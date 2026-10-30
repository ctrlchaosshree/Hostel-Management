/* Plain objects map directly to Java model classes. All records are fictional. */
const SEED = {
  student: {name:'Demo Student', id:'STU1024', course:'B.Tech · Computer Science', year:'2', room:'B-204', bed:'2', phone:'90000 01024', emergency:'90000 01025'},
  rooms: [
    {number:'B-204', block:'B', floor:2, capacity:3, occupants:['Demo Student','Aarav Shah']},
    {number:'B-205', block:'B', floor:2, capacity:3, occupants:['Rohan Patel','Dev Mehta','Kabir Joshi']},
    {number:'B-206', block:'B', floor:2, capacity:3, occupants:[]},
    {number:'B-301', block:'B', floor:3, capacity:3, occupants:['Ishaan Desai']}
  ],
  students: [
    {id:'STU1024', name:'Demo Student', course:'Computer Science', room:'B-204', year:2},
    {id:'STU1025', name:'Aarav Shah', course:'Applied Mathematics', room:'B-204', year:2},
    {id:'STU1026', name:'Rohan Patel', course:'Mechanical Engineering', room:'B-205', year:3},
    {id:'STU1027', name:'Dev Mehta', course:'Computer Science', room:'B-205', year:1},
    {id:'STU1028', name:'Kabir Joshi', course:'Electronics', room:'B-205', year:2},
    {id:'STU1029', name:'Ishaan Desai', course:'Computer Science', room:'B-301', year:3}
  ],
  staff: [
    {name:'Rakesh Patel', department:'Electrical Maintenance'},
    {name:'Suresh Kumar', department:'Plumbing Maintenance'},
    {name:'Meena Shah', department:'Housekeeping'},
    {name:'Vikram Desai', department:'IT Support'},
    {name:'Anil Joshi', department:'General Maintenance'},
    {name:'Neha Rao', department:'Mess Administration'}
  ],
  complaints: [
    {id:'HST-1047', student:'STU1024', category:'Electrical', room:'B-204', description:'Sparking from switchboard near the study table.', priority:'Emergency', date:'2026-10-24', department:'Electrical Maintenance', staff:'Rakesh Patel', status:'In Progress'},
    {id:'HST-1049', student:'STU1024', category:'Wi-Fi', room:'B-204', description:'Wi-Fi disconnects frequently during evening study hours.', priority:'Medium', date:'2026-10-23', department:'IT Support', staff:'Vikram Desai', status:'Assigned'},
    {id:'HST-1048', student:'STU1024', category:'Cleaning', room:'B-204', description:'Please clean the balcony and common area.', priority:'Low', date:'2026-10-22', department:'Housekeeping', staff:'Meena Shah', status:'Resolved'}
  ],
  leaveRequests:[{id:'LV-2001', student:'STU1024', from:'2026-11-01', to:'2026-11-03', reason:'Family function', destination:'Ahmedabad', contact:'90000 01025', status:'Pending'}],
  visitors:[{id:'VIS-3001', student:'STU1024', name:'Priya Shah', relationship:'Parent', date:'2026-10-28', time:'16:00', purpose:'Family visit', status:'Pending'}],
  roomRequests:[],
  fees:{total:50000,paid:40000,due:'2026-11-10'},
  notices:[
    {id:'N-1', title:'Scheduled maintenance this weekend', date:'2026-10-25', category:'Maintenance', description:'Electrical maintenance in Block B on Sunday, 10 AM–12 PM. Please plan accordingly.'},
    {id:'N-2', title:'A little change to your dinner plans', date:'2026-10-24', category:'Mess Update', description:'Dinner will be served from 7:30 PM to 9:30 PM starting Monday.'},
    {id:'N-3', title:'Your space. Keep it a good one.', date:'2026-10-23', category:'General', description:'A friendly reminder to keep common areas clean and observe quiet hours after 10 PM.'},
    {id:'N-4', title:'Diwali holiday leave applications', date:'2026-10-22', category:'Holiday', description:'Submit your holiday leave requests at least 48 hours before departure.'},
    {id:'N-5', title:'Water tank cleaning', date:'2026-10-21', category:'Water Supply', description:'Water supply in Block A will pause from 11 AM to 1 PM on 29 October.'}
  ],
  emergencies:[], feedback:[], nextComplaint:1050, nextSOS:2047
};
const STORAGE_KEY='hostel360-demo-v1';
function loadData(){try {return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(SEED);} catch {return structuredClone(SEED);}}
let db=loadData();
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db));}
function money(n){return '₹'+Number(n).toLocaleString('en-IN');}
function today(){return new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});}
function prettyDate(d){return new Date(d+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});}
function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
/* Explainable rules, no AI or external service. Safety rules override manual priority. */
function classifyComplaint(description, category='Other', priority='Medium'){
 const text=description.toLowerCase();
 // Ordered, explainable safety rules. Higher-risk rules always run first.
 if(/spark|short circuit|exposed wir|electric shock|smoke|fire\b/.test(text)){category='Electrical';priority='Emergency';}
 else if(/gas.*leak|leak.*gas/.test(text)){category='Mess';priority='Emergency';}
 else if(/major.*flood|flooding|burst pipe/.test(text)){category='Plumbing';priority='Emergency';}
 else if(/door.*lock.*(broken|fail)|broken.*lock/.test(text)){category='Furniture';priority='High';}
 else if(/minor.*plumb/.test(text)){category='Plumbing';priority='Medium';}
 else if(/water leak|leakage|bathroom.*(plumb|block)|major.*appliance/.test(text)){category=/appliance/.test(text)?'Electrical':'Plumbing';priority='High';}
 else if(/(fan|light).*(not working|broken|stopped)/.test(text)){category='Electrical';priority='Medium';}
 else if(/clean|sweep|garbage/.test(text)){category='Cleaning';priority='Low';}
 else if(/minor.*furniture|general maintenance/.test(text)){category='Furniture';priority='Low';}
 else if(/wi-?fi|internet/.test(text))category='Wi-Fi';
 const departments={'Electrical':'Electrical Maintenance','Plumbing':'Plumbing Maintenance','Cleaning':'Housekeeping','Wi-Fi':'IT Support','Furniture':'General Maintenance','Mess':'Mess Administration','Other':'General Maintenance'};
 const department=departments[category];
 const member=db.staff.find(s=>s.department===department);
 return {category,priority,department,staff:member?.name||'Warden review',staffId:member?.id||'Unassigned'};
}
