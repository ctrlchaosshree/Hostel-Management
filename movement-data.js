/* Movement model: simple records suitable for Java classes and ArrayLists. */
const MOVEMENT_DEFAULTS = {
  start:'09:00', end:'22:00', specialProcess:'Inform only',
  leaveProcess:'Acknowledgement required', specialStatus:'Submitted',
  authority:'Hostel management / duty warden', guardianRequired:true
};
// Existing students, complaints, fees and all other saved records stay intact.
if (!db.movementVersion) {
  db.hostelTiming={...MOVEMENT_DEFAULTS};
  db.specialOutings=[];
  db.extendedLeaves=(db.leaveRequests||[]).map(r=>({
    id:'EXT-'+r.id, student:r.student, name:db.student.name, room:db.student.room,
    from:r.from, to:r.to, destination:r.destination, reason:r.reason,
    guardianName:'Demo Parent', guardianContact:r.contact||'90000 01025',
    guardianStatus:'Parent/Guardian Confirmation Pending', communicationDate:'',
    additional:'Imported from the previous leave register. Previous decision: '+r.status+'. Please review under the current hostel procedure.',
    status:'Submitted', process:'Acknowledgement required', guardianRequired:true,
    submitted:new Date().toISOString(), departed:false
  }));
  const previous=new Date(); previous.setDate(previous.getDate()-2);
  const date=previous.toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
  db.outings=[
    {id:'OUT-1045',student:db.student.id,name:db.student.name,room:db.student.room,type:'Normal',destination:'College library',reason:'Study',left:date+'T16:30:00+05:30',expected:date+'T19:00:00+05:30',actual:date+'T18:45:00+05:30'},
    {id:'OUT-1046',student:db.student.id,name:db.student.name,room:db.student.room,type:'Normal',destination:'Campus market',reason:'Essentials',left:date+'T17:10:00+05:30',expected:date+'T19:30:00+05:30',actual:date+'T20:05:00+05:30'}
  ];
  db.nextOuting=1047; db.nextSpecial=2047; db.nextExtended=3047;
  db.demoClock=null; db.movementVersion=1;
  saveData();
}
function movementNow(){return db.demoClock?new Date(db.demoClock):new Date();}
function localDateTime(value=movementNow()){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(value));
  const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
function movementDay(value=movementNow()){return localDateTime(value).slice(0,10);}
function parseHostelTime(value){return new Date(value+':00+05:30');}
function timeLabel(value){return new Date(value).toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit'});}
function dateTimeLabel(value){return value?prettyDate(movementDay(value))+' · '+timeLabel(value):'—';}
function hoursLabel(){return timeLabel('2000-01-01T'+db.hostelTiming.start+':00+05:30')+' – '+timeLabel('2000-01-01T'+db.hostelTiming.end+':00+05:30');}
function minutesOf(time){const [h,m]=time.split(':').map(Number);return h*60+m;}
function insideNormalHours(at=movementNow()){
  const t=minutesOf(localDateTime(at).slice(11));
  const start=minutesOf(db.hostelTiming.start),end=minutesOf(db.hostelTiming.end);
  // Cross-midnight windows are supported. Start is inclusive, end exclusive.
  return start<end?t>=start&&t<end:t>=start||t<end;
}
function normalWindowEnd(at=movementNow()){
  const current=localDateTime(at), day=current.slice(0,10);
  let end=parseHostelTime(day+'T'+db.hostelTiming.end);
  if(db.hostelTiming.start>db.hostelTiming.end&&minutesOf(current.slice(11))>=minutesOf(db.hostelTiming.start))end=new Date(end.getTime()+86400000);
  return end;
}
function currentOuting(student=db.student.id){return db.outings.find(o=>o.student===student&&!o.actual);}
function outingStatus(o,at=movementNow()){
  if(o.actual)return new Date(o.actual)>new Date(o.expected)?'Late Return':'Returned On Time';
  return at>new Date(o.expected)?'Overdue Return':'Outside Hostel';
}
function delayMinutes(o){return Math.max(0,Math.ceil(((o.actual?new Date(o.actual):movementNow())-new Date(o.expected))/60000));}
function movementCounts(records){return {
  total:records.length,onTime:records.filter(o=>o.actual&&outingStatus(o)==='Returned On Time').length,
  late:records.filter(o=>o.actual&&outingStatus(o)==='Late Return').length,
  outside:records.filter(o=>!o.actual).length,
  overdue:records.filter(o=>outingStatus(o)==='Overdue Return').length,
  soon:records.filter(o=>!o.actual&&new Date(o.expected)>=movementNow()&&new Date(o.expected)-movementNow()<=3600000).length
};}
function processSatisfied(r){return r.process==='Inform only'||r.process==='Acknowledgement required'&&['Acknowledged','Approved'].includes(r.status)||r.process==='Approval required'&&r.status==='Approved';}
function guardianSatisfied(r){return !r.guardianRequired||r.guardianStatus==='Parent/Guardian Confirmation Recorded';}
function canDepart(r,type){return processSatisfied(r)&&(type!=='extended'||guardianSatisfied(r));}
function captureOutingContext(){const o=currentOuting();return o?{outingId:o.id,destination:o.destination,left:o.left,expected:o.expected,type:o.type}:null;}
