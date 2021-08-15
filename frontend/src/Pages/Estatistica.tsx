import { FormControl, MenuItem, Select } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {
    Line,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface Stats {
    attendances: number;
    users: number;
    good_feedbacks: number;
    bad_feedbacks: number;
    avg_time: number;
    leave_rate: number;
    attendances_two_hours: {
        hour: number;
        atendidos: number;
    }[]
}
function Estatistica() {
    const [periodo, setPeriodo] = useState("Hoje");
    const [stats, setStats] = useState<Stats>()
    const fetchHistory = async () => {
        const from = '2000-08-09T20:00:00.000Z';
        const to = '2023-08-09T20:00:00.000Z';
        const res = await axios.get(`http://localhost:3333/api/atendimento/estatisticas?start=${from}&end=${to}`);
        const arr = res.data;
        setStats(arr)
    }
    useEffect(() => {        
        fetchHistory();
    }, [])
    return (
        <>
            {stats ?
                <div style={{ marginLeft: "2%"}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <h2 id="est-top">
                            Estatísticas
                        </h2>
                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <h2 id="est-top">Período</h2>
                            <FormControl style={{ marginLeft: "20px" }}>
                                <Select
                                    value={periodo}
                                    onChange={(e: any) => setPeriodo(e.target.value)}
                                    displayEmpty
                                    style={{ width: '150px', textAlign: 'center' }}
                                >
                                    <MenuItem value={"Hoje"}>Hoje</MenuItem>
                                    <MenuItem value={"Semana"}>Essa Semana</MenuItem>
                                    <MenuItem value={"Mês"}>Esse Mês</MenuItem>
                                    <MenuItem value={"Ano"}>Esse Ano</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div id="painel-estat-top">
                        <div>
                            <p>Atendimentos realizados</p>
                            <h3>{stats.attendances}</h3>
                        </div>
                        <div>
                            <p>Total de usuários</p>
                            <h3>{stats.users}</h3>
                        </div>
                        <div>
                            <p>Feedbacks positivos</p>
                            <h3>{stats.good_feedbacks}</h3>
                        </div>
                        <div>
                            <p>Feedbacks negativos</p>
                            <h3>{stats.bad_feedbacks}</h3>
                        </div>
                    </div>
                    <div id="painel-estat-middle">
                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <AccessTimeIcon fontSize="large" />
                            <p>Tempo médio de espera</p>
                        </div>
                        <div>
                            <h3>{`${stats.avg_time}min`}</h3>
                        </div>
                    </div>
                    <div id="painel-estat-bottom">
                        <div style={{ width: "70%" }}>
                            <p>Atendimentos a cada duas horas</p>
                            <ResponsiveContainer height="85%">
                                <LineChart style={{ backgorundColor: 'black' }}
                                    width={document.getElementById('two-hours')?.clientWidth}
                                    data={stats.attendances_two_hours}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <XAxis dataKey={(el) => `${el.hour}h`} />
                                    <YAxis />
                                    <Tooltip />
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Line type="monotone" dataKey="atendidos" stroke="#ff7300" yAxisId={0} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ width: "25%" }}>
                            <p>Taxa de abandono</p>
                            <div>
                                <h2>{`${stats.leave_rate}%`}</h2>
                            </div>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    );
}

export default Estatistica;
