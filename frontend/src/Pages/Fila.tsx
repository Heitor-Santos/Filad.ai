import React, {useState} from 'react';
import Container from '@material-ui/core/Container'
import './Fila.css'
import {
    makeStyles, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";

interface User {
    nome: any;
    idade: any;
    sexo: any;
    telegram_id: any;
}

function FilaGeral() {
    return (
        <Container>
            <div className="box-superior">
                <div className="box-esquerda">
                    <p>
                        <h1>Fila</h1>
                    </p>
                    <p id="white">
                        Visão geral da fila
                    </p>
                </div>
                <div className="box-direita">
                    <div className="clock">
                        <img className="clock-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABTBJREFUaEPVmmfot1MYxz8PZWWUkReUvUkksotsEnrsQslOvLIS2a+QTSmyV2a2F0a8sFdGRooXZvZM9Pl1Dud3nnP/7nMP6X+9+j+/+7quc33Puc61zjOPOU7z5rj9jAVgSWBbYDtgQ2BtYAXA36Ufgc+BD4C3gKeBZ4Gfhm7gEADK7gocAewFLNbRmF+B+4EbgMeAvzrKT9j7ApgPnAls1GfRgswbwDnAPV31dQWwFnA1sGPXhSr5nwCOC65WJdIFwCHANYlf5wt8GFzhOeBd4BPgh8C0FLAKsG64K7sAqzdYqMzRwG01CGoAyHM+cFpB4Z/AHcAVwAs1CwYedW4JnADsDyxckHVN3XTm3WgD4PergGMKC3jxTgTe72B4iXUd4HJgp8JH3fX4WSDaAFwInJop/jkYfv1Aw3Pxo4BLgcWzD+eFkyguNwuAPn9zJmUs3x14pcL4PYFrA58+/VCFzGbAwyGHpOwHAbeX5JsAGG00MiYiZb8Iieq9CkNk+RRYKfB+BqxcKadLmeRMhJG+BzYFDBRT1ATgySxU6jZm2pqdjwvkl6/NXVPDPIlnMnd6HDB6tQIwSd2Z8R0JdPX5IQBc3jsRXTCasy9wb2pbviv++/Usw5pcdq48/pRtKAB1PRLKlahX2zZJo1IOYLdwiaKAcX79nqFyDADrAW9meUIbH40G5gB0HV0o0i3AoT12X5ExAKjHjHxgYoPRyKg0oRSAEefLrKrcqmOGHduF1Lc1YHkS6RdgecDAMgUgdx9DluG0V5k74gm4ydqyWgLCaGRUmgJwEXBKwmQJYRrvS2O5kOtbRJoMI1khnJ4DeBAwe0Y6uLYibEA4JoC8KngA2DsHYIa1FYxkuHqt7/aP6EKaYBZ+ObHFct0INeVCXwHLJUz+/c2IAJYBLAn6kJfWABNJWyelRhqFfgMWSZj8+48+qwWZ3IVsVLxX3rVvO+pdFLCHjqStkx58FgCFfu+4UMqeFnPp757qJcBlHU6kCsDXwLLJSh6bv/UlA4ITh9Qt+wKpcqH8EntxXu1rfZBbOjQ/J2ebk6p1kw5v6ReqLvHYYTQ1sg1IW79gOXNTorAYRvP20X7UEceY1ASkDUCeyC4AzsgvsVM2y9dIHwFrDiglZgGPQNwgo9WsltNAoy2rJgqLpUSpmLOQen7MI+iha5vQYkZRizhzwALFnAzOeJzTRLoVMI3/n2T5fEBigOW1Zc6E8n4gdyMbmg2A2kZ+bKA2U85N08GXNjqTKgIQkDWHdVCkvi3lGGCeAnZIFFmbGVL/yfKlScF+wN3Z6l6y68awqIOOY0PpkYrsA9yX/tA06rBZSEd9dkE+XrzUwYAhrJuHR5D0zcE+2KZripoAGD6dATlVjmQ16Gzov74PTrCdCaWDre+C6xhOqwDIZONsFEpJEHsALw7Z3hmyWwBWBKnxshsZ7yrJtU3LHKxOMl5ClrUnFYZOQzHp8xcXnqp8uTmrSXkbAL9fCag8J8ePjtffGWi5odLxehptokrX9g2hkdoAKCjPuYWT8Jt5wlmSC5mxaycY6jTLa5xzqIUKFs7c+chfAyDyOlwylKYXO1334zDqcLLsqZSemOxjDQTWMmltk+qx7XQWW/T5HGgXAMquEWJzn1lpjacZKh3lLBBt+t6BJjkTihdr4xqrKnjMsGeHd+MK9n9Zup5AqlxZXeGwMKPJn4baDDE5mlVvDK5Xe3+m9A4BkCpaArDs3T4Uf86XViz8VwMfBN8OWdZ556QkHkJjARhiwyDZOQ/gb/FR/zGwrmdBAAAAAElFTkSuQmCC"/>
                        <p className="clock-text">
                            Tempo médio de espera
                        </p>
                        <p style={{}}>
                            Tempo médio
                        </p>
                    </div>
                    <div className="pacientes">
                        <p style={{marginBottom: '1rem'}}>
                            Pacientes hoje
                        </p>
                        <p>
                            Num. pacientes
                        </p>
                    </div>
                </div>
            </div>
            <div className="box-inferior">
                <div>
                    <TabelaNovos />
                </div>
                <div>
                    {/*<TabelaAndamento />*/}
                </div>
            </div>
        </Container>
    );
}

function TabelaNovos() {
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

    function createUser(nome: any, idade: any, sexo: any, telegram_id: any): User {
        return { nome, idade, sexo, telegram_id };
    }
    let rows = [
        createUser('Andre Vsasconcelos', '21', 'M', 'andre69'),
        createUser('Andre Vasconcelos', '21', 'M', 'andre59'),
        createUser('Andre Vasconcelos', '21', 'M', 'andre49'),
        createUser('Andre Vasconcelos', '21', 'M', 'andre39'),
        createUser('Andre Vasconcrelos', '21', 'M', 'andr269'),
        createUser('Andre Vassconcelos', '21', 'M', 'andr169'),
        createUser('Andre Vasconcelos', '21', 'M', 'andre89'),
        createUser('Andre Vascowncelos', '21', 'M', 'andr069'),
        createUser('Andre Vsasconcelos', '21', 'M', 'and2e69'),
        createUser('Andre Vasconcelos', '21', 'M', 'andr1e69'),
        createUser('Andre Vsascofncelos', '21', 'M', 'an4dre69'),
        createUser('Andre Vasconcelos', '21', 'M', 'andr5e69'),
        createUser('Andre Vascodncelos', '21', 'M', 'an7dre69'),
        createUser('Andre Vasconcelos', '21', 'M', 'and8re69'),
        createUser('Andre Vasconcelos', '21', 'M', 'andr9e69'),
    ];

    //não implementado ainda
    function acceptUser(user: any) {
        rows.splice(rows.indexOf(user), 1);
        console.log(user)
    }
    //não implementado ainda
    function rejectUser(user: any) {
        rows.splice(rows.indexOf(user), 1);
        console.log(user)
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

    const labelRows = (page: number, rowsPerPage:number, length:number) => {
        return `${page * rowsPerPage + 1}-${page * rowsPerPage + rowsPerPage} de ${length}`
    }
    return(
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h3>Novos pedidos de atendimento</h3>
                <h4>2</h4>
            </div>
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
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                                            <img style={{width: '20px', cursor: 'pointer'}} onClick={() => acceptUser(row)} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABVJJREFUaEPVmkeoZUUQhr9RMaEbdXChYM6KKKKYQTErYnZUDCBmxJ0JUcwrEcyCoJgTRswuDOjCnDBgQNCFEcw58F26pW9Pn9t9bmB8tXpzT3V1/acr/F1n5jHHZd4c959pAVgO2B7YAdgYWBeYD/i78iPwBfAh8DbwDPAc8NOkL3ASAK7dHTgG2AdYuqczvwIPADcCjwP/9Fw/UB8XwEHAOcAm42xaWPMmcD5wb197fQGsA1wD7Nx3o0b9J4GTQqg1LekD4HDg2iSu8w0+CqHwPPAe8CnwQ1BaHlgNWD/kym7Amh0euuZ44PYWBC0A1LkIOLNg8C/gTuBK4MWWDYOONrcGTgEOBhYvrHVPw3RkbtQA+Pxq4ITCBibeqcAHPRwvqa4HXAHsUnhouJ48CkQNwCXAGZnhn4PjN0zoeL78OOByYJnswYXhJIrbjQJgzN+SrbKW7wm8OmXno7ktgEdCD0m3WADcUdqzC4DVRidjI3Ltl6FRvT8j56NZQ8omZyOM8j2wOWChGJIuAE9lpdKwsdPO6s3nfnkSz2bh9ARg9aoCsEndlekdC0w75msHaU5clyntD9yX/pafgP9+I+uwNpdda7vN6Pmjga5E8/q2WVqVcgB7hCSKC6zzG06hVI6LbwPgraxP6ONj0WAOwNAxhKLcChxR2X3v5KjtCzU+s19ofJq14z5csW9HPjTRsRpZlQaSArDifJWxym0aOuxnwCrB3p8BsN25JIeE0rxEePg5sGoFwLaA9CTKL8BKgIVlCEAePpYsy2mN5qYAtNkFInde3RYAvmR9WSMBYTWyKg0BuBQ4PVGSQtjGa3JAaDLxrZZAlJwXqDxoqKp0bCaJNNyiyBDOygE8BBjPUQ5rZYTAgUE3BWEBOBr4DbgNyJ8dBZhjLZKzggeBfXMAdlivglEsV6+3WA86JRB/hxBM2abA+jivebvwK4kv0nUr1FAIfQ2smCj597c9AKhaApGaGMd515u0Fpgo+jqgGmkV8qiXTJT8+4+eACIIS13O8T2NI3uETbr1UoB36Cj6OriDjwLgot/HAGAfsXaXABg6OcNt2aIJwDfACok1j83f+ojO5wmbh5CJ3RdEUwjlSWzivNbD+5LzXUncF0RTEk9SRkvOx4Q1Xg2pUoltPQnpzM3JyyyW0fz66H3UEUdNFkUjuxg4O09ip2zS1ygfA2v/T6iEvqye+FakEiUyJ5F6oXIEsyZz24UrZnRDEmcPWIjMqSCLlJ9EsaLYxkfJrOm0PUUuFcV8kuYMJL8P5GFkIm4EzPoi3/WCvEw5N017ij46kyoCEJCcQx4UZVFeKZ8Gdkp8kZtZUv+j+KWphFXlnuyVSGWvr4TStB+fGKaCqV1vc/enP3SNVbwspKM+b0F+vHh52l522NsyfARJvzl4D/bSNSRdACyfzoCcKkeRDTobmnU+OMF2JpQOtr4LoWM5bQKgkhdnq1AqgtgLeGlGJ7EVICNInXcrK+PdpT1rw10Hq4OOl4i09rTC0GlSTMb8ZYVPVX65ObfLeA2Az68CNJ6L40fHKO9O6Lml0vF6Wm2iSff2G0Kn1AC4UJ0LCifhM/uEsyQ3smPXJhjREW3a5XVOIrhYwcORbz411PoCHS5ZStPETtd+EkYdTpY9ldInJu+xFgK5TMptUjtOop3FFmM+d7blBNI1a4XaPKtZqaXSUc5C1WbcHOhaZ0MxsTZtPb6Knh32vPDduJfJvieQGnetoeA91xlN/mmo5ojN0a56Uwi91vwZsjsJgNTQsoC0d8dA/pwvrVz4rwZ+EHwndFnnnQNKPIlMC8AkPky0ds4D+Bec5CNASPuPpwAAAABJRU5ErkJggg=="/>
                                            <img style={{width: '18px', cursor: 'pointer'}} onClick={() => rejectUser(row)} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABdlJREFUaEPNmlWMZUUQhr8N7s4u7vJAggRb3OEBl11sEwjuTnALgeALYdmgwTUh+OIki/sDD0iQ4LKLS4KTb1I9uSP3ntPnnHuZSibzcLurq7q7qv76+4yiGRkDbAasA6wMLAssAMwJ/Av8CkwDPgTeAV4CngG+qbv8qBoKNHAvYAKwZgU9OvYycAtwB/B9BR1UcWBx4HjgAGD2lkV/AV4A3gLeC4OSUfMB/q0ErAKsF6eTpjv3auAS4MscR3IcmAk4DjgNmCMW+QG4C7g9jP+r5OLq0ok9gXHAvDFPR84CLgdK6SrrgDunoavGQu7SxbFr3u86YpwcFKdqLCmvA+OBD4oUl3FgF+DGOHJ35YrYpZ+LlGf+PjdwNnA4MCPwE7A38GAnPUUO7ANcGwo/A3YHns80LHf42nHaSwN/A4cC17RT0smBg4HJMdHg3B74NteaiuMXjJ1fN9KwCeP64XS1c8Br452fAXgM2Bn4raIxVaeZKO4FtoqA1oYh12k4B5aPIPJOmqc3j0JU1ZA682YDngDWB4y5tYB3WxUOdmBm4JXINp8Aa/Tw2rRzdCHgDcD6Y3byWvWn2MEOnAScHwM2jtxeZwebmrtBQA+zk7Xo0qS41YHF4ni8ew5w4EiSicBRcZVWBL7SuFYH0gCLlIWr6TxfdzOMSSHK6CiiJ7Q6IDDzzottBhxR3VUbnq/RFwJCjiXFW+kEjogKK7YxWOrCgxy7TdV7RIC+XTBR2GFBnScK3OTkwKsBiUWEFrBeiUF5U4C61yJNFq0tMtgfeFFAqAOLAJ9HPGwEPFukoaHfNf62QKOqPCUyYJH6TYGno0KP1gEhrYq8V/MDfxZpaOB34fSdUeFVdwFgCi8j1qrvAtKP0wGx95EBGbYpo6HmGA0QpuwYes4EzsnUaXXewnSvA2Id8YbdkJ1WN0Xj7wZ2iEVOB86tsOBlwNHAwzpg02ATbvAaxN2SWYB7gO1igVOB8youdghwlXVBB4TI3n0RqOivGyIoux/YMoLvWMDCWVV2jc2YpgO/Ax7t1sDjVTV2mGdx1HjvrEyER29XV0e09VFt77YD4qoHgjPSeJPFlXUsj7kDHKhyhQxCM5ZBOL2NQXMBjwAiyX+icb+uAeNVsVskg+mewPvAcplB/CawWpR/G54fBxlmqZ8CjA3j9wtioCH7+/rkSdremkZzILSZxIC3mtrke6QJP8nxmJptzm3K9w32rSnj1ZNq15TWQmYAa0hZMRNYTQVjTwHbArP2wHjtcz252Ik6IBKUWasCJWQLrB3qeQiwKVo94IicjkWrabGeSFmamse7sGzYF2GEbeTUzBXNLB5pErGU/FG3aorpWChhVhuT4LSNvB2/BJI0X66cEazaH0EJ3perIGP8DRFXUvRjh2tolojrlKGzb6jElycpru+W2FZ+CvhfCnJScsCW8uOAqLZtErcjUU4O/GTGW0oY1NrUJ4Rnt29TL7k6ksT3BZt6acd+5NyOVhFoHTOSrI/CZQGTLRmWVtHeE6M7kvmydXtuhDixCfBk1Bx7Fk+gTwYzc7Z68qHmcrt//7fDOr3yTR5I6GLvLsUotdjf9haRu6ZXsY5F7v8Qobg7L6bSBh8TO5K7ycidomEQJggxpLZ7yRVphxyQ9cQNFFNpg9B8gHR64DiwpcW0aAjgenWdvDa+BVhcrbgWV/mgIZL7xCQF023eSDgjNls0dv6wTr16kQN6LP1xM2CDYnYShwsdmq4T5nkZCnfbq6t+H9GHXJvWYyjjgONXCC7HrKR8HanMN7S6AS4scJdt9C1SitnGZ1abrY5S1gGVmGJtyN19A0yxE5Mq8chtbARzZURIvGF8qmBw6oRikfKp1aa/FEOY40AyzHwsXjLI04u9v5mlJFzTpwb22rLdil2aT0XpUwPTong+iXPtKy5KDxdldsExVRxIugWANkM2LraPubrSxx63xsce8p3ZkrtouwUWDuhhlfRzm2Vix9NVM0783Oajpj+3+Q/IJkEVXheK3AAAAABJRU5ErkJggg=="/>
                                        </TableCell>
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


export default FilaGeral;
