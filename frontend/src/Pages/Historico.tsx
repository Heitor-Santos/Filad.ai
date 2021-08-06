import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import React, { useState } from 'react';

function Histórico() {

    interface Column {
        id: 'name' | 'age' | 'sex' | 'feedback' | 'telegram' | 'visit';
        label: string;
        minWidth?: number;
        align?: 'right' | 'center';
        format?: (value: number) => string;
    }

    interface Data { 
        name: string;
        age: string;
        sex: string;
        feedback: string;
        telegram: string;
        visit: string;
    }

    //const [rows, setRows] = useState<Array<>>([]);
    const columns: Column[] = [
        { id: 'name', label: 'Nome', minWidth: 170 },
        { id: 'age', label: 'Idade', minWidth: 100},
        { id: 'sex', label: 'Sexo', minWidth: 100, align: 'center'},
        { id: 'feedback', label: 'Feedback', minWidth: 100, align: 'center'},
        { id: 'telegram', label: 'Telegram', minWidth: 100, align: 'center'},
        { id: 'visit', label: 'Data', minWidth:170, align: 'right'}
    ];

    function createData(name: string, age: string, sex: string, feedback: string, telegram:string, visit:string): Data {
        return { name, age, sex, feedback, telegram, visit};
      }
      
      const rows = [
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
        createData('Andre Vasconcelos', '21', 'M', 'Botão', 'Botão', '21/07/2021'),
      ];

    const useStyles = makeStyles({
        root: {
            width: '100%',
        },
        container: {
            maxHeight: 440,
        },
    });

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            <p>
                <Typography variant= "h3" gutterBottom> 
                Histórico 
                </Typography>
            </p>
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
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
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