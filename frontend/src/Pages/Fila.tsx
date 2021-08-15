import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fila.css'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@material-ui/core";
import { AccessTime, People, Timer, Watch } from '@material-ui/icons';

interface User {
    nome: any;
    idade: any;
    sexo: any;
    telegram_id: any;
    username: any;
}

const telegram_icon = 'data:image/png;base64,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';
const deny_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABVJJREFUaEPVmkeoZUUQhr9RMaEbdXChYM6KKKKYQTErYnZUDCBmxJ0JUcwrEcyCoJgTRswuDOjCnDBgQNCFEcw58F26pW9Pn9t9bmB8tXpzT3V1/acr/F1n5jHHZd4c959pAVgO2B7YAdgYWBeYD/i78iPwBfAh8DbwDPAc8NOkL3ASAK7dHTgG2AdYuqczvwIPADcCjwP/9Fw/UB8XwEHAOcAm42xaWPMmcD5wb197fQGsA1wD7Nx3o0b9J4GTQqg1LekD4HDg2iSu8w0+CqHwPPAe8CnwQ1BaHlgNWD/kym7Amh0euuZ44PYWBC0A1LkIOLNg8C/gTuBK4MWWDYOONrcGTgEOBhYvrHVPw3RkbtQA+Pxq4ITCBibeqcAHPRwvqa4HXAHsUnhouJ48CkQNwCXAGZnhn4PjN0zoeL78OOByYJnswYXhJIrbjQJgzN+SrbKW7wm8OmXno7ktgEdCD0m3WADcUdqzC4DVRidjI3Ltl6FRvT8j56NZQ8omZyOM8j2wOWChGJIuAE9lpdKwsdPO6s3nfnkSz2bh9ARg9aoCsEndlekdC0w75msHaU5clyntD9yX/pafgP9+I+uwNpdda7vN6Pmjga5E8/q2WVqVcgB7hCSKC6zzG06hVI6LbwPgraxP6ONj0WAOwNAxhKLcChxR2X3v5KjtCzU+s19ofJq14z5csW9HPjTRsRpZlQaSArDifJWxym0aOuxnwCrB3p8BsN25JIeE0rxEePg5sGoFwLaA9CTKL8BKgIVlCEAePpYsy2mN5qYAtNkFInde3RYAvmR9WSMBYTWyKg0BuBQ4PVGSQtjGa3JAaDLxrZZAlJwXqDxoqKp0bCaJNNyiyBDOygE8BBjPUQ5rZYTAgUE3BWEBOBr4DbgNyJ8dBZhjLZKzggeBfXMAdlivglEsV6+3WA86JRB/hxBM2abA+jivebvwK4kv0nUr1FAIfQ2smCj597c9AKhaApGaGMd515u0Fpgo+jqgGmkV8qiXTJT8+4+eACIIS13O8T2NI3uETbr1UoB36Cj6OriDjwLgot/HAGAfsXaXABg6OcNt2aIJwDfACok1j83f+ojO5wmbh5CJ3RdEUwjlSWzivNbD+5LzXUncF0RTEk9SRkvOx4Q1Xg2pUoltPQnpzM3JyyyW0fz66H3UEUdNFkUjuxg4O09ip2zS1ygfA2v/T6iEvqye+FakEiUyJ5F6oXIEsyZz24UrZnRDEmcPWIjMqSCLlJ9EsaLYxkfJrOm0PUUuFcV8kuYMJL8P5GFkIm4EzPoi3/WCvEw5N017ij46kyoCEJCcQx4UZVFeKZ8Gdkp8kZtZUv+j+KWphFXlnuyVSGWvr4TStB+fGKaCqV1vc/enP3SNVbwspKM+b0F+vHh52l522NsyfARJvzl4D/bSNSRdACyfzoCcKkeRDTobmnU+OMF2JpQOtr4LoWM5bQKgkhdnq1AqgtgLeGlGJ7EVICNInXcrK+PdpT1rw10Hq4OOl4i09rTC0GlSTMb8ZYVPVX65ObfLeA2Az68CNJ6L40fHKO9O6Lml0vF6Wm2iSff2G0Kn1AC4UJ0LCifhM/uEsyQ3smPXJhjREW3a5XVOIrhYwcORbz411PoCHS5ZStPETtd+EkYdTpY9ldInJu+xFgK5TMptUjtOop3FFmM+d7blBNI1a4XaPKtZqaXSUc5C1WbcHOhaZ0MxsTZtPb6Knh32vPDduJfJvieQGnetoeA91xlN/mmo5ojN0a56Uwi91vwZsjsJgNTQsoC0d8dA/pwvrVz4rwZ+EHwndFnnnQNKPIlMC8AkPky0ds4D+Bec5CNASPuPpwAAAABJRU5ErkJggg==';
const accept_icon = 'data:image/png;base64,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';

const DialogConfirmDelete = (props: any) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Feedback do usuário"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Deseja remover {props.user.nome} da fila?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleRemove} color="primary">
                    Remover
                </Button>
                <Button onClick={props.handleClose} color="primary">
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function FilaGeral() {
    const [filaAtendimento, setFilaAtendimento] = useState<User[]>([]);
    const [clientsToday, setClientsToday] = useState(0);
    const [averageWaitTime, setAverageWaitTime] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [isDesistencia, setDesistencia] = useState(false);
    const [currUser, setCurrUser] = useState(0);

    const fetchStatus = async () => {
        const res = await axios.get('http://localhost:3333/api/fila/status');
        return {
            clients: res.data.clientsToday || 0,
            wait: res.data.averageWaitMin || 0,
            fila: res.data.fila.map((user: any) => {
                return createUser(user.name, user.age, user.sex, user.telegram_id, user.username);
            })
        };
    };

    const updateStates = (res: any) => {
        setClientsToday(res.clients);
        setAverageWaitTime(res.wait);
        setFilaAtendimento(res.fila);
    }

    const initConfig = () => {
        fetchStatus().then((res) => {
            updateStates(res);
        });
        updateTimeout();
    }

    const updateTimeout = () => {
        setInterval(() => {
            fetchStatus().then((res) => {
                updateStates(res);
            });
        }, 1500);
    }

    useEffect(initConfig, []);

    const removeUserFromQueue = (telegram_id: number, desistencia: boolean, index: number) => {
        const newArr = [...filaAtendimento];
        newArr.splice(index, 1);
        setFilaAtendimento(newArr);
        axios.post('http://localhost:3333/api/fila/sair', { telegram_id, desistencia });
    }

    interface Column {
        id: 'nome' | 'idade' | 'sexo';
        label: string;
        minWidth?: number;
        align?: 'right' | 'center';
        format?: (value: number) => string;
    }

    const columns: Column[] = [
        { id: 'nome', label: 'Nome', minWidth: 130 },
        { id: 'idade', label: 'Idade', minWidth: 60, align: 'center' },
        { id: 'sexo', label: 'Sexo', minWidth: 60, align: 'center' }
    ];

    function createUser(nome: any, idade: any, sexo: any, telegram_id: any, username: any): User {
        return { nome, idade, sexo, telegram_id, username };
    }

    const useStyles = makeStyles({
        root: {
            width: '100%',
        },
        container: {
            maxHeight: 500,
        },
    });

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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

    const showDialog =(desistencia: boolean, index: number) =>{
        setDesistencia(desistencia);
        setCurrUser(index);
        setOpenDialog(true);
    }

    return (
        <div style={{ marginLeft: "2%" }}>
            <div className="box-superior">
                <div className="box-esquerda">
                    <p>
                        <h1>Fila</h1>
                    </p>
                    <p>
                        Visão geral da fila
                    </p>
                </div>
                <div className="box-direita">
                    <div className="clock" >
                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <AccessTime />
                            <p className="clock-text">
                                Tempo médio de espera
                            </p>
                        </div>
                        {/*pegar info do back*/}
                        <h1 style={{ textAlign: "center", marginTop: 0 }}>
                            {averageWaitTime} min
                        </h1>
                    </div>
                    <div className="pacientes">
                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <People />
                            <p>
                                Pacientes hoje
                            </p>
                        </div>
                        {/*pegar info do back*/}
                        <h1 style={{ textAlign: "center", marginTop: 0 }}>
                            {clientsToday}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="box-inferior">
                {/*fila em andamento*/}
                <div style={{ margin: '0 10px', width: "100%" }}>
                    <div>
                        <DialogConfirmDelete open={openDialog} user={filaAtendimento[currUser]} handleClose={() => setOpenDialog(false)} handleRemove={() => removeUserFromQueue(filaAtendimento[currUser].telegram_id, isDesistencia, currUser)} />
                        {/*atualizar a tabela após aceitação/remoção de usuario*/}
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
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filaAtendimento.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.telegram_id}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell>
                                                        {filaAtendimento[idx].username ? <a target='_blank' href={'https://t.me/' + filaAtendimento[idx].username}><img style={{ width: '18px', cursor: 'pointer' }} src={telegram_icon} /></a> : null}
                                                        <img onClick={() => showDialog(true, idx)} style={{ width: '20px', cursor: 'pointer' }} src={deny_icon} />
                                                        <img onClick={() => showDialog(false, idx)} style={{ width: '18px', cursor: 'pointer' }} src={accept_icon} />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                labelRowsPerPage='Linhas por página:'
                                labelDisplayedRows={() => labelRows(page, rowsPerPage, filaAtendimento.length)}
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={filaAtendimento.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default FilaGeral;
