/* Solar equations derived from SunCalc by Vladimir Agafonkin (BSD-2-Clause). */
const PI=Math.PI, rad=PI/180, DAY=86400000, J1970=2440588, J2000=2451545
const toDays=(d:Date)=>d.valueOf()/DAY-.5+J1970-J2000
const fromJulian=(j:number)=>new Date((j+.5-J1970)*DAY)
function solar(d:number){const M=rad*(357.5291+.98560028*d),L=M+rad*(1.9148*Math.sin(M)+.02*Math.sin(2*M)+.0003*Math.sin(3*M))+rad*102.9372+PI;return{M,L,dec:Math.asin(Math.sin(L)*Math.sin(rad*23.4397))}}
function transit(ds:number,M:number,L:number){return J2000+ds+.0053*Math.sin(M)-.0069*Math.sin(2*L)}
export function solarTimes(date:Date,lat:number,lon:number){const lw=-lon*rad,phi=lat*rad,n=Math.round(toDays(date)-.0009-lw/(2*PI)),ds=.0009+lw/(2*PI)+n,c=solar(ds),noon=transit(ds,c.M,c.L),h=-.833*rad,v=(Math.sin(h)-Math.sin(phi)*Math.sin(c.dec))/(Math.cos(phi)*Math.cos(c.dec)),w=Math.acos(Math.max(-1,Math.min(1,v))),set=transit(.0009+(w+lw)/(2*PI)+n,c.M,c.L);const sunset=fromJulian(set),sunrise=fromJulian(noon-(set-noon));return{sunrise,sunset,isDay:+date>=+sunrise&&+date<+sunset}}
export function moonPhase(date:Date){const synodic=29.53058867,epoch=Date.UTC(2000,0,6,18,14),days=(+date-epoch)/DAY;return ((days/synodic)%1+1)%1}
