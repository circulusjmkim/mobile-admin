import React from 'react';
import { Grid, Button, TextField, Card, CardContent, Typography, CardActions, Table, TableBody, TableRow, TableCell, InputAdornment, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ClearIcon from '@material-ui/icons/Clear';
import { useMount, useUpdateEffect } from 'react-use';
import EnvSelect from '../components/EnvSelect';
import { initialize, findClick, textChange, clearClick, transfertData } from '../features/robot';
import { useStyles } from '../styles/robotStyle';

const RobotTransferDataContainer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector(state => state.robot);
  const { dataError, data, result, error, params } = selector;
  const { beforeSerial, afterSerial } = params;

  const handleFindClick = () => {
    dispatch(findClick());
  };

  const handleTextChange = (e) => {
    dispatch(textChange(e));
  };

  const handleClickClear = (name) => () => {
    dispatch(clearClick(name));
  }

  const handleTransferClick = ({userId, serial}) => () => {
    dispatch(transfertData({ serial, newSerial: afterSerial, userId }));
  };

  useUpdateEffect(() => {
    if(result) {
      setTimeout(() => {
        dispatch(initialize());
      }, 2000);
    }
  }, [result]);

  useMount(() => {
    dispatch(initialize());
  });

  return (
    <Grid container
      direction="column"
      justifyContent="flex-start"
      className={classes.root}
      >
        <Grid item xs={6} md={2} className={classes.marginVertical}>
          <EnvSelect />
        </Grid>
        <Grid container item xs={12} md={10} style={{display: 'inline-flex'}}>
          <Grid item>
            <TextField
              id="beforeSerial"
              name="beforeSerial"
              className={classes.textField} 
              label='정보 이전을 위한 로봇의 ObjectId 또는 Serial No.를 입력하세요.'
              onChange={handleTextChange} 
              value={beforeSerial || ''}
              error={dataError}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (<InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickClear('beforeSerial')}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>)
              }}
            />
          </Grid>
          <Grid item className={classes.marginVertical}>
            <Button variant="contained" color="primary"  onClick={handleFindClick}>검색</Button>
          </Grid>
        </Grid>
        {dataError && (<Grid item xs={12}>
          <Typography variant="h6">{dataError}</Typography>
        </Grid>)}
        <Grid container item xs={12}>
          {data.map(({_id: id, robotId, userId, }) => (
            <Grid item>
              <Card className={classes.cardRoot} key={id}>
                <CardContent>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell className={classes.cellProp}>
                          <Typography color="textSecondary">
                            userId
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <span className={classes.cardValue}>{userId}</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cellProp}>
                          <Typography color="textSecondary">
                            ObjectId
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <span className={classes.cardValue}>{id}</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cellProp}>
                          <Typography color="textSecondary">
                            Serial No.
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <span className={classes.cardValue}>{robotId}</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  {
                    !result && (
                      <TextField
                        id="afterSerial"
                        name="afterSerial"
                        className={classes.cardTextField} 
                        label='새로운 로봇의 Serial No.를 입력하세요.'
                        onChange={handleTextChange} 
                        value={afterSerial}
                        error={dataError}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (<InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickClear('afterSerial')}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>)
                        }}
                      />
                    )
                  }
                  {
                    (error || result) && (
                      <Typography variant="subtitle1">
                        {
                          result === false && <Typography variant="body2" color="textSecondary" className={classes.cardError}>{error}</Typography>
                        }
                        {
                          result && !error && (
                            <>
                              <p>{`${beforeSerial} 로봇의 데이터가 ${afterSerial}`}</p>
                              <p>로봇에 이전되었습니다.</p>
                            </>
                            )
                        }
                      </Typography>
                    )
                  }
                </CardContent>
                {
                  !result && (
                    <CardActions>
                      <Button size="small" color="secondary" className={classes.btn} onClick={handleTransferClick({userId, serial: robotId})}>데이터 이전</Button>
                    </CardActions>
                  )
                }
              </Card>
            </Grid>
          ))}
        </Grid>
    </Grid>
  )
};

export default RobotTransferDataContainer;
