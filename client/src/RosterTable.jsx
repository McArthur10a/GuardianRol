import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RosterTable = () => {
  // 1. ESTADOS Y PERSISTENCIA
  const [employees, setEmployees] = useState(() => JSON.parse(localStorage.getItem("bch_employees")) || []);
  const [shifts, setShifts] = useState(() => JSON.parse(localStorage.getItem("bch_shifts")) || {});
  const [observations, setObservations] = useState(localStorage.getItem("bch_obs") || "");
  const [notifyHours, setNotifyHours] = useState(() => JSON.parse(localStorage.getItem("bch_notify_hours")) || ["08:00", "12:00", "13:00"]);
  
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentWeek, setCurrentWeek] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [newHour, setNewHour] = useState("");
  const [isAlertActive, setIsAlertActive] = useState(false);
  const fileInputRef = useRef(null);

  // 2. LÓGICA DE NOTIFICACIONES
  const sendNotification = (title, msg) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: msg,
        icon: "https://cdn-icons-png.flaticon.com/512/552/552402.png"
      });
    }
  };

  const saveAndActivateAlerts = () => {
    if (newHour && !notifyHours.includes(newHour)) {
      const updated = [...notifyHours, newHour].sort();
      setNotifyHours(updated);
      localStorage.setItem("bch_notify_hours", JSON.stringify(updated));
      setIsAlertActive(true);
      sendNotification("✅ Alerta Configurada", `El sistema le avisará a las ${newHour}`);
      setNewHour("");
      setTimeout(() => setIsAlertActive(false), 2000);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      if (notifyHours.includes(currentTime) && now.getSeconds() === 0) {
        sendNotification("🚨 RELEVO DE GUARDIA", `Son las ${currentTime}. Proceder con el cambio.`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [notifyHours]);

  // 3. ESTADÍSTICAS AUTOMÁTICAS
  const calculateStats = () => {
    let ord = 0, noct = 0;
    Object.values(shifts).forEach(d => {
      if (d.shift === "08-16") ord += 8;
      else if (d.shift === "00-08") noct += 8;
      else if (d.shift === "16-00") { ord += 4; noct += 4; }
    });
    return [
      { name: 'Ord.', h: ord, fill: '#3b82f6' },
      { name: 'Noct.', h: noct, fill: '#1e293b' }
    ];
  };

  // 4. LÓGICA DE TURNOS Y COLORES
  const getStatusColor = (shiftVal, spotVal, isToday) => {
    const combined = (shiftVal + " " + spotVal).toUpperCase();
    if (combined.includes("VACACIONES")) return "#FFCFD2";
    if (combined.includes("LIBRE")) return "#E9ECEF";
    if (shiftVal || spotVal) return "#D4EDDA";
    return isToday ? "#ebf5ff" : "#FFFFFF"; // Azul tenue si es hoy
  };

  useEffect(() => {
    const daysArr = [];
    const today = new Date();
    const labels = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      daysArr.push({ label: labels[d.getDay()], num: d.getDate(), dateKey: d.toDateString(), isToday: i === 0 });
    }
    setCurrentWeek(daysArr);
    Notification.requestPermission();
  }, []);

  return (
    <div style={styles.container}>
      {/* SECCIÓN SUPERIOR: DASHBOARD PROFESIONAL */}
      <div style={styles.topGrid} className="no-print">
        <div style={styles.card}>
          <h3 style={styles.smallTitle}>📊 CARGA HORARIA SEMANAL</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={calculateStats()}>
              <Bar dataKey="h" radius={[4,4,0,0]}>
                {calculateStats().map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
              <XAxis dataKey="name" fontSize={10} />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h3 style={styles.smallTitle}>⏰ CONFIGURAR ALERTAS</h3>
          <div style={{display:'flex', gap:'8px'}}>
            <input type="time" value={newHour} onChange={(e)=>setNewHour(e.target.value)} style={styles.timeInput}/>
            <button onClick={saveAndActivateAlerts} style={{...styles.btnSave, background: isAlertActive ? '#10b981' : '#3b82f6'}}>
              {isAlertActive ? "ACTIVADO" : "GUARDAR"}
            </button>
            <button onClick={() => sendNotification("🔔 Prueba", "Sistema funcionando")} style={styles.btnTest}>🧪</button>
          </div>
          <div style={styles.chipBox}>
            {notifyHours.map(h => <span key={h} style={styles.chip}>{h} <b onClick={()=>setNotifyHours(notifyHours.filter(x=>x!==h))}>×</b></span>)}
          </div>
        </div>
      </div>

      {/* BARRA DE ACCIONES */}
      <div style={styles.toolbar} className="no-print">
        <h2 style={styles.mainTitle}>MATRIZ TÉCNICA SEGURIDAD BCH</h2>
        <div style={{display:'flex', gap:'10px'}}>
          <button onClick={() => setShowModal(true)} style={styles.btnBlue}>➕ Agente</button>
          <button onClick={() => { localStorage.setItem("bch_shifts", JSON.stringify(shifts)); alert("💾 Sincronizado"); }} style={styles.btnGreen}>💾 Sincronizar</button>
          <button onClick={() => window.print()} style={styles.btnGray}>🖨️</button>
        </div>
      </div>

      {/* TABLA CON RESALTADO DE HOY E INICIALES */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{background:'#0f172a', color:'#fff'}}>
              <th style={styles.th}>PERSONAL</th>
              {currentWeek.map(day => (
                <th key={day.dateKey} style={{...styles.th, background: day.isToday ? '#1d4ed8' : '#0f172a'}}>
                  {day.label} {day.num}
                  {day.isToday && <div style={{fontSize:'8px', color:'#93c5fd'}}>HOY</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td style={styles.tdName}>
                  <div style={styles.avatar}>{emp.name.split(" ").map(n=>n[0]).join("").substring(0,2)}</div>
                  <b>{emp.name}</b>
                </td>
                {currentWeek.map(day => {
                  const d = shifts[`${emp.id}-${day.dateKey}`] || { shift: "", spot: "" };
                  return (
                    <td key={day.dateKey} style={{...styles.tdCell, backgroundColor: getStatusColor(d.shift, d.spot, day.isToday)}}>
                      <div style={styles.cellBox}>
                        <input type="text" value={d.spot} onChange={(e)=> {
                          const key=`${emp.id}-${day.dateKey}`;
                          setShifts({...shifts, [key]: {...d, spot: e.target.value.toUpperCase()}});
                        }} placeholder="Puesto" style={styles.cellInpSpot}/>
                        <input type="text" value={d.shift} onChange={(e)=> {
                          const key=`${emp.id}-${day.dateKey}`;
                          setShifts({...shifts, [key]: {...d, shift: e.target.value.toUpperCase()}});
                        }} placeholder="00-00" style={styles.cellInpShift}/>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NOVEDADES Y VOZ */}
      <div style={styles.obsSection}>
        <div style={styles.obsHeader}>
          <h3 style={styles.smallTitle}>📝 NOVEDADES</h3>
          <div>
            <button onClick={() => {
              const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
              rec.lang = 'es-HN'; rec.onstart = () => setIsListening(true);
              rec.onresult = (e) => setObservations(prev => prev + " " + e.results[0][0].transcript);
              rec.onend = () => setIsListening(false); rec.start();
            }} style={{...styles.roundBtn, background: isListening ? '#ef4444' : '#3b82f6'}}>🎤</button>
            <button onClick={()=>fileInputRef.current.click()} style={{...styles.roundBtn, background:'#10b981'}}>📎</button>
            <input type="file" ref={fileInputRef} style={{display:'none'}} />
          </div>
        </div>
        <textarea style={styles.area} value={observations} onChange={(e)=>setObservations(e.target.value)} placeholder="Escriba o use el micrófono..." />
      </div>

      {/* MODAL BUSCADOR */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <input type="text" placeholder="Buscar..." style={styles.modalSearch} onChange={(e)=>setSearchTerm(e.target.value.toUpperCase())} />
            <div style={styles.list}>
               {[{id:1, name:'MARCO TULIO'}].filter(x=>x.name.includes(searchTerm)).map(e=>(
                 <div key={e.id} style={styles.listItem} onClick={()=>{setEmployees([...employees, e]); setShowModal(false)}}>👤 {e.name}</div>
               ))}
            </div>
            <button onClick={()=>setShowModal(false)} style={styles.btnClose}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ESTILOS CONSOLIDADOS
const styles = {
  container: { padding: "20px", background: "#f1f5f9", minHeight: "100vh", fontFamily: "sans-serif" },
  topGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" },
  card: { background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  smallTitle: { margin: "0 0 10px 0", fontSize: "11px", color: "#64748b", fontWeight: "bold" },
  timeInput: { padding: "5px", borderRadius: "5px", border: "1px solid #ddd" },
  btnSave: { border: "none", color: "#fff", padding: "5px 12px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  btnTest: { border: "none", background: "#f1f5f9", cursor: "pointer", borderRadius: "5px" },
  chipBox: { display: "flex", gap: "5px", marginTop: "10px", flexWrap: "wrap" },
  chip: { background: "#eef2ff", color: "#312e81", padding: "3px 8px", borderRadius: "12px", fontSize: "10px", border: "1px solid #c7d2fe" },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  mainTitle: { fontSize: "18px", color: "#1e293b", margin: 0, fontWeight: "800" },
  btnBlue: { padding: "10px 15px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  btnGreen: { padding: "10px 15px", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  btnGray: { padding: "10px 15px", background: "#475569", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  tableWrapper: { background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px", fontSize: "11px", textAlign: "center" },
  tdName: { padding: "10px", display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", borderBottom: "1px solid #f1f5f9" },
  avatar: { width: "30px", height: "30px", background: "#e2e8f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold" },
  tdCell: { border: "1px solid #f1f5f9", padding: "5px" },
  cellBox: { display: "flex", flexDirection: "column" },
  cellInpSpot: { width: "100%", border: "none", background: "transparent", fontSize: "10px", textAlign: "center" },
  cellInpShift: { width: "100%", border: "none", background: "transparent", fontSize: "12px", textAlign: "center", fontWeight: "bold" },
  obsSection: { marginTop: "20px", background: "#fff", padding: "15px", borderRadius: "10px" },
  obsHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  roundBtn: { width: "35px", height: "35px", borderRadius: "50%", border: "none", color: "#fff", cursor: "pointer" },
  area: { width: "100%", height: "80px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "10px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 },
  modal: { background: "#fff", padding: "20px", borderRadius: "10px", width: "350px" },
  modalSearch: { width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px" },
  btnClose: { width: "100%", padding: "10px", background: "#64748b", color: "#fff", border: "none", borderRadius: "5px" }
};

export default RosterTable;