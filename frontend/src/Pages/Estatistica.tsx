import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import React, { useState } from 'react';

function Estatistica() {
    const [periodo, setPeriodo] = useState("Hoje");
    return (
        <div style={{ marginLeft: "2%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    <h3>45</h3>
                </div>
                <div>
                    <p>Total de usuários</p>
                    <h3>178</h3>
                </div>
                <div>
                    <p>Feedbacks positivos</p>
                    <h3>100</h3>
                </div>
                <div>
                    <p>Feedbacks negativos</p>
                    <h3>78</h3>
                </div>
            </div>
            <div id="painel-estat-middle">
                <div style={{ display: 'flex', alignItems: "center" }}>
                    <AccessTimeIcon fontSize="large" />
                    <p>Tempo médio de espera</p>
                </div>
                <div>
                    <h3>23min</h3>
                </div>
            </div>
            <div id="painel-estat-bottom">
                <div style={{ width: "70%" }}>
                    {/* The Graph goes here */}
                </div>
                <div style={{ width: "25%" }}>
                    <p>Taxa de abandono</p>
                    <div>
                        <h2>11%</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Estatistica;
