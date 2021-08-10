import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, FormControl, makeStyles, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Theme } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import TelegramIcon from '@material-ui/icons/Telegram';
import FeedbackIcon from '@material-ui/icons/Feedback';
import axios from 'axios';

interface Column {
    id: 'name' | 'age' | 'sex' | 'feedback' | 'telegram' | 'visit';
    label: string;
    minWidth?: number;
    align?: 'right' | 'center';
    format?: (value: number) => string;
}

interface Rows { 
    name: string;
    age: number;
    sex: any;
    feedback: any;
    telegram: any;
    visit: any;
}

function Histórico() {
    const [rows, setRows] = useState<Array<Rows>>([])

    const fetchHistory = async () => {
        const from = '2000-08-09T20:00:00.000Z';
        const to = '2023-08-09T20:00:00.000Z';
        const res = await axios.get(`http://localhost:3333/api/fila/historico?start=${from}&end=${to}`);
        
        const arr = res.data;
        const rowsTest = [
            createRows('Andre Vasconcelos', 21, 'M', 'Botão Feedback', 'Botão Telegram', '21/07/2021'),
        ]
        for (let client of arr){
            const data = new Date(client.saiu_da_fila_em).toLocaleDateString();
            rowsTest.push(createRows(client.nome, Number(client.idade), client.sexo, 'Botão Feedback', 'Botão Telegram', data));
        };

        setRows(rowsTest);
    }

    useEffect(() => {        
        fetchHistory();
    }, [])

    const columns: Column[] = [
        { id: 'name', label: 'Nome', minWidth: 170 },
        { id: 'age', label: 'Idade', minWidth: 100, align: 'center' },
        { id: 'sex', label: 'Sexo', minWidth: 100, align: 'center' },
        { id: 'feedback', label: 'Feedback', minWidth: 100, align: 'center' },
        { id: 'telegram', label: 'Telegram', minWidth: 100, align: 'center' },
        { id: 'visit', label: 'Data', minWidth: 100, align: 'center' }
    ];

    function createRows(name: string, age: number, sex: string, feedback: any, telegram:any, visit:any): Rows {
        return { name, age, sex, feedback, telegram, visit };
      }

    const useStyles = makeStyles({
        root: {
            width: '100%',
        },
        container: {
            maxHeight: 600,
        },
    });
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [periodo, setPeriodo] = useState("Hoje");
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const labelRows = (page: number, rowsPerPage:number, length:number) => {
        return `${page * rowsPerPage + 1}-${page * rowsPerPage + rowsPerPage} de ${length}`
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (newFeedback : string) => {
        setFeedback(newFeedback);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [feedbackAtual, setFeedback] = useState <string>();
    return (
        <div style ={{marginLeft: "2%"}}>
            <div style ={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2 id="hist-top">
                    Histórico
                </h2>
                <div style={{ display: 'flex', alignItems: "center" }}>
                    <h2 id="hist-top">Período</h2>
                    <FormControl style={{ marginLeft: "20px"}}>
                        <Select 
                            value={periodo}
                            onChange={(e: any) => setPeriodo(e.target.value)}
                            displayEmpty
                            style={{ width: '150px', textAlign: 'center' }}
                        >
                            <MenuItem value={"Hoje"}>Hoje</MenuItem>
                            <MenuItem value={"Semana"}>Semana</MenuItem>
                            <MenuItem value={"Mês"}>Mês</MenuItem>
                            <MenuItem value={"Ano"}>Ano</MenuItem>
                        </Select>
                    </FormControl>
                    <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                    <DialogTitle id="alert-dialog-title">{"Feedback do usuário"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {feedbackAtual}
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Fechar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
            
            {/* Tabela */}
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell 
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            if (value==="Botão Feedback") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                            <Button onClick={()=>handleClickOpen(row.feedback)}>
                                                                <FeedbackIcon />
                                                            </Button>
                                                    </TableCell>
                                                )
                                            }
                                            if (value==="Botão Telegram") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                            <Button onClick={()=>alert('Telegram')}>
                                                                <TelegramIcon />
                                                                </Button>
                                                        </TableCell>
                                                        )
                                            }
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination 
                labelRowsPerPage='Linhas por página:'
                labelDisplayedRows={() => labelRows(page, rowsPerPage, rows.length)}
                rowsPerPageOptions={[10,25,100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default Histórico;