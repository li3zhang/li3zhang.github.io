//initialize some defaults
//decline variables
var dqi0 = 600;
var dbfac0 = 1;  //b factor 0-1
var ddec0 = 0.60;  //decline exponent as decimal 1% - 100%
var dmindec0 = .10;  //minimum decline
var dgor0 = 3000;
var timeinc0 = 365;
var startdate0 = new Date(2016,0,0);
var ngshrink0 = .05;
var ngyield0 = 13;
var Rwor0 = 3;

//interests
var intWRI = .95;
var intNRI = 0.875;

//taxes
var taxOilSev = .046;
var taxGasSev = .075;
var taxConSev = .046;
var taxAdVal = .031;

//costs
var drillCompleteCost0 = 7200000;
var disposalCost0 = 3;

//economic variables
var discountRate0 = 0.1;

var priceOil = [
  {date:new Date(2000,1,1), price:40},
  {date:new Date(2016,3,1), price:45},
  {date:new Date(2017,3,1), price:65},
  {date:new Date(2050,1,1), price:100}
  ];

var priceGas = [
  {date:new Date(2000,1,1), price:1.8},
  {date:new Date(2016,1,1), price:2},
  {date:new Date(2016,4,1), price:2.5},
  {date:new Date(2016,8,1), price:2.8},
  {date:new Date(2016,12,1), price:4},
  {date:new Date(2018,1,1), price:5},
  {date:new Date(2050,1,1), price:5}
  ];

var priceOpcost = [
  {date:new Date(2000,1,1), price:10500},
  {date:new Date(2016,1,1), price:10500},
  {date:new Date(2016,4,1), price:7500},
  {date:new Date(2016,8,1), price:6000},
  {date:new Date(2016,12,1), price:3500},
  {date:new Date(2018,1,1), price:3500},
  {date:new Date(2050,1,1), price:3500}
  ];

var priceCapital = [
  {date:new Date(2000,1,1), price:0},
  {date:new Date(2016,1,1), price:1600},
  {date:new Date(2016,1,2), price:0},
  {date:new Date(2050,1,2), price:0}
  ];



//var dec1 = makeDecline(dqi0, dbfac0, ddec0, dmindec0, dgor0, timeinc0, startdate0, ngshrink0, ngyield0, Rwor0, intWRI, intNRI, taxOilSev, taxGasSev, taxConSev, taxAdVal, drillCompleteCost0, disposalCost0, discountRate0);
//printcols(dec1);
//console.table(dec1, ['timeDT', 'rateOil', 'revenueNetTotal', 'costTotal' ,'cfUndiscBtax', 'cfDiscBtax', 'cfUndiscAtax', 'cfDiscAtax']);
//console.table(dec1);
//console.log(priceOil[1].date);
//returnAnnualIRR(dec1);




function makeDecline(dqi, dbfac, ddec, dmindec, dgor, timeinc, startdate, ngshrink, ngyield, Rwor, intWRI, intNRI, taxOilSev, taxGasSev, taxConSev, taxAdVal, drillCompleteCost, disposalCost, discountRate) {
  cols = [];


  //for (var i = 0; i < timeinc; i++) {
  for (var i = 0; i < 10*365; i++) {


    //this chunk of code does decline curve calculations and minimum decline rate logic
    xyzrate = 0;
    afac = (Math.pow((1-ddec),-1*dbfac)-1)/dbfac;
    afactime = afac*Math.pow((1+dbfac*afac*(i/timeinc)),-1);
    deffect = 1- Math.pow((1+dbfac*afactime),(-1/dbfac));

    if (dbfac == 0) {
      dnoma = -Math.log(1-ddec);
      xyzrate = dqi*Math.exp(-1*dnoma*(i/timeinc));
    }
    else {
      dnoma = -Math.log(1-ddec);
      decexpon = (-1/dbfac);
      xyzrate = dqi*Math.pow((1+dbfac*afac*(i/timeinc)),decexpon);
      if (deffect < dmindec) {
        dnoma = -Math.log(1-dmindec);
        xyzrate = (cols[i-1].rateOil)*Math.exp(-1*dnoma*(1/timeinc));
      }
    }
    //from here, xyzrate is the daily oil rate

    cols[i] = {
      time: i,
      timeN: i/timeinc,
      timeDT:addDays(startdate, i),
      rateOil: xyzrate,
      rateGas: (dgor/1000)*xyzrate,
      rateGasShrunk: (1-ngshrink)*(dgor/1000)*xyzrate,
      rateCondensate: (ngyield/1000)*(dgor/1000)*xyzrate,
      rateWater: xyzrate*Rwor,
      priceOil: makePrice(addDays(startdate, i), priceOil),
      priceGas: makePrice(addDays(startdate, i), priceGas),
      //costDisposal: xyzrate*Rwor*disposalCost,
      costDisposalNet: xyzrate*Rwor*disposalCost*intWRI,
      costOperating: makePrice(addDays(startdate, i), priceOpcost)/30
    };
    cols[i].costOperatingNet = cols[i].costOperating * intWRI;
    cols[i].revenueGrossOil = cols[i].rateOil*cols[i].priceOil;
    cols[i].revenueGrossGas = cols[i].rateGasShrunk*cols[i].priceGas;
    cols[i].revenueGrossCon = cols[i].rateCondensate*cols[i].priceOil;
    cols[i].revenueNetOil = cols[i].revenueGrossOil * intNRI;
    cols[i].revenueNetGas = cols[i].revenueGrossGas * intNRI;
    cols[i].revenueNetCon = cols[i].revenueGrossCon * intNRI;
    cols[i].revenueNetTotal = cols[i].revenueNetOil + cols[i].revenueNetGas + cols[i].revenueNetCon;
    cols[i].costTotal = cols[i].costDisposalNet + cols[i].costOperatingNet;
    cols[i].cfUndiscBtax = cols[i].revenueNetTotal - cols[i].costTotal;
    cols[i].cfDiscBtax = PV(discountRate/timeinc, i, cols[i].cfUndiscBtax);
    cols[i].taxSeverance = cols[i].revenueNetOil * taxOilSev + cols[i].revenueNetGas * taxGasSev + cols[i].revenueNetCon * taxConSev;
    cols[i].taxAdvalorem = cols[i].revenueNetTotal * taxAdVal;
    cols[i].cfUndiscAtax = cols[i].cfUndiscBtax - cols[i].taxSeverance - cols[i].taxAdvalorem;
    cols[i].cfDiscAtax = PV(discountRate/timeinc, i, cols[i].cfUndiscAtax);

  }

  //apply drill and complete costs
  cols[0].cfUndiscBtax -= drillCompleteCost;
  cols[0].cfDiscBtax -= drillCompleteCost;
  cols[0].cfUndiscAtax -= drillCompleteCost;
  cols[0].cfDiscAtax -= drillCompleteCost;
  return cols;

}



function makePrice(date, priceDeck) {
  //uses price deck provided to interpolate price at selected date.

  var bestPrevDate = priceDeck.length;
  var bestNextDate = priceDeck.length;

  var max_date_value = Math.abs((new Date(0,0,0)).valueOf());
  var bestPrevDiff = max_date_value;
  var bestNextDiff = -max_date_value;

  var currDiff = 0;
  var i;

  for (i = 0; i < priceDeck.length; i++) {
    currDiff = date - priceDeck[i].date;
    if(currDiff == 0) {
      bestPrevDate = i;
      bestNextDate = i;
      break;
    }
    if(currDiff < 0 && currDiff > bestNextDiff) {
      bestNextDate = i;
      bestNextDiff = currDiff;
    }
    if(currDiff > 0 && currDiff < bestPrevDiff) {
      bestPrevDate = i;
      bestPrevDiff = currDiff;
    }
  }

  if(bestPrevDate-bestNextDate == 0) {
    return priceDeck[bestPrevDate].price;
  }

  diffDaysTotal = Math.round(Math.abs((priceDeck[bestPrevDate].date - priceDeck[bestNextDate].date)/8.64e7));
  diffDaysInterm = Math.round(Math.abs((priceDeck[bestPrevDate].date - date)/8.64e7));
  expPrice = priceDeck[bestPrevDate].price + diffDaysInterm * (priceDeck[bestNextDate].price - priceDeck[bestPrevDate].price) / diffDaysTotal;
  return expPrice;
}


function returnAnnualIRR (declineOutput) {
  //ror is calculated with undiscounted values
  console.log("Calculating ROR with "+declineOutput.length +" days of data.");
  cfdisctableBT = declineOutput.map(function(a) {return a.cfUndiscBtax;});
  yearlyDiscBT = reduceAnnual(cfdisctableBT);
  btror = IRR.apply(this, yearlyDiscBT);

  cfdisctableAT = declineOutput.map(function(a) {return a.cfUndiscAtax;});
  yearlyDiscAT = reduceAnnual(cfdisctableAT);
  atror = IRR.apply(this, yearlyDiscAT);
  return [btror*12, atror*12];
}

//present value
function PV(rate, nper, fv) {
  return fv * 1/(Math.pow(1+rate,nper));
}

//iterative process for IRR
function seekZero (fn) {
  var x = 1;
  while (fn(x) > 0) {
    x += 1;
  }
  while (fn(x) < 0) {
    x -= 0.01
  }
  return x + 0.01;
}

// Internal Rate of Return (IRR)
function IRR (cfs) {
  var args = arguments;
  function npv(rate) {
    var rrate = (1 + rate/100);
    var npv = args[0];
    for (var i = 1; i < args.length; i++) {
      npv += (args[i] / Math.pow(rrate, i));
    }
    return npv;
  }
  return (seekZero(npv) * 100) / 100;
}

function NPV (cfs) {
  var npvbt = 0;
  cfdisctableBT = cfs.map(function(a) {return a.cfDiscBtax;});
  for (var i = 0; i < cfdisctableBT.length; i++) {
    npvbt += cfdisctableBT[i];
  }
  var npvat = 0;
  cfdisctableAT = cfs.map(function(a) {return a.cfDiscAtax;});
  for (var i = 0; i < cfdisctableAT.length; i++) {
    npvat += cfdisctableAT[i];
  }
  return [npvbt, npvat];
}

function reduceAnnual (dailyArr) { //reduces data to monthly data points, returnAnnualIRR multiples by 12 to get annual IRR
  yearlyArr = [];
  reducetimes = Math.floor(dailyArr.length/30);
  for (var i = 0 ; i < reducetimes; i++ ) {
    yearlyVal = 0;
    for (var j = 0; j < 30; j++) {
      yearlyVal += dailyArr[i*30+j];
    }
    yearlyArr.push(yearlyVal);
  }
  return (yearlyArr);
}


function addDays(date, days) {
  var dat = new Date(date);
  dat.setDate(dat.getDate() + days);
  return dat;
}


function printcols(curve) {
  for (var i = 0; i < 10; i++) {
    //console.log("time: "+col_time[i]+", ntime: "+col_ntime[i].toFixed(2)+", rate: "+col_drate[i].toFixed(2));
    console.log(curve[i]);

  }
}

Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
