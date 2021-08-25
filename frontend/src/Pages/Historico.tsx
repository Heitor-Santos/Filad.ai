import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, FormControl, makeStyles, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Theme } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import TelegramIcon from '@material-ui/icons/Telegram';
import FeedbackIcon from '@material-ui/icons/Feedback';
import axios from 'axios';

interface Column {
    id: 'name' | 'age' | 'sex' | 'bt_feedback' | 'bt_telegram' | 'visit';
    label: string;
    minWidth?: number;
    align?: 'right' | 'center';
    format?: (value: number) => string;
}

const telegram_icon = 'data:image/png;base64,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';

interface Rows {
    name: string;
    age: number;
    sex: any;
    bt_feedback: any;
    feedback: any;
    bt_telegram: any;
    telegram: any;
    visit: any;
    username?: string;
}

function Histórico() {
    const [rows, setRows] = useState<Array<Rows>>([])

    const fetchHistory = async () => {
        const from = '2000-08-09T20:00:00.000Z';
        const to = '2023-08-09T20:00:00.000Z';
        const res = await axios.get(`http://localhost:3333/api/atendimento/historico?start=${from}&end=${to}`);

        const arr = res.data ? res.data.reverse() : [];
        const rowsTest = []
        for (let client of arr) {
            let data = new Date(client.entrou_na_fila_em).toLocaleDateString();
            if (!client.saiu_da_fila_em) data += '\nDesistência';
            rowsTest.push(createRows(client.nome, Number(client.idade), client.sexo, 'Botão Feedback', client.feedback, 'Botão Telegram', client.telegram_id, data, client.username));
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
        { id: 'bt_feedback', label: 'Feedback', minWidth: 100, align: 'center' },
        { id: 'bt_telegram', label: 'Telegram', minWidth: 100, align: 'center' },
        { id: 'visit', label: 'Data', minWidth: 100, align: 'center' }
    ];

    function createRows(name: string, age: number, sex: string, bt_feedback: any, feedback: any, bt_telegram: any, telegram: any, visit: any, username: string): Rows {
        return { name, age, sex, bt_feedback, feedback, bt_telegram, telegram, visit, username };
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

    const labelRows = (page: number, rowsPerPage: number, length: number) => {
        return `${page * rowsPerPage + 1}-${page * rowsPerPage + rowsPerPage} de ${length}`
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (newFeedback: any) => {
        if (newFeedback) {
            setFeedback(["O usuário deu um feedback " + (newFeedback.positivo ? "positivo :)" : "negativo :("), `Classificou o atendimento como: ${newFeedback.detalhe}`]);
        }
        else setFeedback(["Este usuário não deu feedback"]);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [feedbackAtual, setFeedback] = useState<string[]>([]);
    return (
        <div style={{ marginLeft: "2%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2 id="hist-top">
                    Histórico
                </h2>
                <div style={{ display: 'flex', alignItems: "center" }}>
                    <h2 id="hist-top">Período</h2>
                    <FormControl style={{ marginLeft: "20px" }}>
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
                                {feedbackAtual.map(paragraph =>
                                    <div key={paragraph}>
                                        <p>{paragraph}</p>
                                    </div>

                                )}
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
                                            if (value === "Botão Feedback") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <Button onClick={() => handleClickOpen(row.feedback)}>
                                                            <FeedbackIcon />
                                                        </Button>
                                                    </TableCell>
                                                )
                                            }
                                            if (value === "Botão Telegram") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {row.username ?
                                                            <a target='_blank' href={'https://t.me/' + row.username}><img style={{ width: '18px', cursor: 'pointer' }} src={telegram_icon} /></a>
                                                            :
                                                            <p>-</p>
                                                        }
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
                    rowsPerPageOptions={[10, 25, 100]}
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