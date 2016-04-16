function makeDecline(e,a,t,c,r,o,s,n,i,l,d,p,f,u,D,y,x,v,w){cols=[];for(var h=0;3650>h;h++)xyzrate=0,afac=(Math.pow(1-t,-1*a)-1)/a,afactime=afac*Math.pow(1+a*afac*(h/o),-1),deffect=1-Math.pow(1+a*afactime,-1/a),0==a?(dnoma=-Math.log(1-t),xyzrate=e*Math.exp(-1*dnoma*(h/o))):(dnoma=-Math.log(1-t),decexpon=-1/a,xyzrate=e*Math.pow(1+a*afac*(h/o),decexpon),deffect<c&&(dnoma=-Math.log(1-c),xyzrate=cols[h-1].rateOil*Math.exp(-1*dnoma*(1/o)))),cols[h]={time:h,timeN:h/o,timeDT:addDays(s,h),rateOil:xyzrate,rateGas:r/1e3*xyzrate,rateGasShrunk:(1-n)*(r/1e3)*xyzrate,rateCondensate:i/1e3*(r/1e3)*xyzrate,rateWater:xyzrate*l,priceOil:makePrice(addDays(s,h),priceOil),priceGas:makePrice(addDays(s,h),priceGas),costDisposalNet:xyzrate*l*v*d,costOperating:makePrice(addDays(s,h),priceOpcost)/30},cols[h].costOperatingNet=cols[h].costOperating*d,cols[h].revenueGrossOil=cols[h].rateOil*cols[h].priceOil,cols[h].revenueGrossGas=cols[h].rateGasShrunk*cols[h].priceGas,cols[h].revenueGrossCon=cols[h].rateCondensate*cols[h].priceOil,cols[h].revenueNetOil=cols[h].revenueGrossOil*p,cols[h].revenueNetGas=cols[h].revenueGrossGas*p,cols[h].revenueNetCon=cols[h].revenueGrossCon*p,cols[h].revenueNetTotal=cols[h].revenueNetOil+cols[h].revenueNetGas+cols[h].revenueNetCon,cols[h].costTotal=cols[h].costDisposalNet+cols[h].costOperatingNet,cols[h].cfUndiscBtax=cols[h].revenueNetTotal-cols[h].costTotal,cols[h].cfDiscBtax=PV(w/o,h,cols[h].cfUndiscBtax),cols[h].taxSeverance=cols[h].revenueNetOil*f+cols[h].revenueNetGas*u+cols[h].revenueNetCon*D,cols[h].taxAdvalorem=cols[h].revenueNetTotal*y,cols[h].cfUndiscAtax=cols[h].cfUndiscBtax-cols[h].taxSeverance-cols[h].taxAdvalorem,cols[h].cfDiscAtax=PV(w/o,h,cols[h].cfUndiscAtax);return cols[0].cfUndiscBtax-=x,cols[0].cfDiscBtax-=x,cols[0].cfUndiscAtax-=x,cols[0].cfDiscAtax-=x,cols}function makePrice(e,a){var t,c=a.length,r=a.length,o=Math.abs(new Date(0,0,0).valueOf()),s=o,n=-o,i=0;for(t=0;t<a.length;t++){if(i=e-a[t].date,0==i){c=t,r=t;break}0>i&&i>n&&(r=t,n=i),i>0&&s>i&&(c=t,s=i)}return c-r==0?a[c].price:(diffDaysTotal=Math.round(Math.abs((a[c].date-a[r].date)/864e5)),diffDaysInterm=Math.round(Math.abs((a[c].date-e)/864e5)),expPrice=a[c].price+diffDaysInterm*(a[r].price-a[c].price)/diffDaysTotal,expPrice)}function returnAnnualIRR(e){console.log("Calculating ROR with "+e.length+" days of data."),cfdisctableBT=e.map(function(e){return e.cfDiscBtax}),yearlyDiscBT=reduceAnnual(cfdisctableBT),console.log("BTAX DISCOUNTED ROR: "+IRR.apply(this,yearlyDiscBT)),cfdisctableAT=e.map(function(e){return e.cfDiscAtax}),yearlyDiscAT=reduceAnnual(cfdisctableAT),console.log("ATAX DISCOUNTED ROR: "+IRR.apply(this,yearlyDiscAT))}function PV(e,a,t){return 1*t/Math.pow(1+e,a)}function seekZero(e){for(var a=1;e(a)>0;)a+=1;for(;e(a)<0;)a-=.01;return a+.01}function IRR(e){function a(e){for(var a=1+e/100,c=t[0],r=1;r<t.length;r++)c+=t[r]/Math.pow(a,r);return c}var t=arguments;return 100*seekZero(a)/100}function reduceAnnual(e){yearlyArr=[],reducetimes=Math.floor(e.length/365);for(var a=0;a<reducetimes;a++){yearlyVal=0;for(var t=0;365>t;t++)yearlyVal+=e[365*a+t];yearlyArr.push(yearlyVal)}return yearlyArr}function addDays(e,a){var t=new Date(e);return t.setDate(t.getDate()+a),t}function printcols(e){for(var a=0;10>a;a++)console.log(e[a])}var dqi0=600,dbfac0=1,ddec0=.6,dmindec0=.1,dgor0=3e3,timeinc0=365,startdate0=new Date(2016,3,1),ngshrink0=.05,ngyield0=13,Rwor0=3,intWRI=.95,intNRI=.875,taxOilSev=.046,taxGasSev=.075,taxConSev=.046,taxAdVal=.031,drillCompleteCost0=72e5,disposalCost0=3,discountRate0=.1,priceOil=[{date:new Date(2e3,1,1),price:35},{date:new Date(2016,3,1),price:38},{date:new Date(2017,3,1),price:40},{date:new Date(2050,1,1),price:72}],priceGas=[{date:new Date(2e3,1,1),price:1.8},{date:new Date(2016,1,1),price:2},{date:new Date(2016,4,1),price:2.5},{date:new Date(2016,8,1),price:2.8},{date:new Date(2016,12,1),price:4},{date:new Date(2018,1,1),price:5},{date:new Date(2050,1,1),price:5}],priceOpcost=[{date:new Date(2e3,1,1),price:10500},{date:new Date(2016,1,1),price:10500},{date:new Date(2016,4,1),price:7500},{date:new Date(2016,8,1),price:6e3},{date:new Date(2016,12,1),price:3500},{date:new Date(2018,1,1),price:3500},{date:new Date(2050,1,1),price:3500}],priceCapital=[{date:new Date(2e3,1,1),price:0},{date:new Date(2016,1,1),price:1600},{date:new Date(2016,1,2),price:0},{date:new Date(2050,1,2),price:0}];
