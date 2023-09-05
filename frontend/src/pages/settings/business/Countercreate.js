import React, { useState } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

export default function Countercreate({ counters, setCounters }) {

  const [subStringVal, setSubStringVal] = useState("0001");

  // Pop up error
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState("")
  const handleClickOpen = () => { setIsErrorOpen(true); };
  const handleClose = () => { setIsErrorOpen(false); };

  function addCounter() {

    // First one
    if (!counters.some(item => item.countername?.trim() !== "")) {
      setShowAlert("Please Enter Counter No");
      handleClickOpen();
      return;
    }
    // Check if any counter names from the second counter are empty
    if (counters.slice(1).some(item => item.countername?.trim() === "")) {
      setShowAlert("Please Enter Counter No");
      handleClickOpen();
      return;
    }

    const maxCounterId = counters.reduce((maxId, counter) => {
      const counterId = parseInt(counter.counterid);
      return counterId > maxId ? counterId : maxId;
    }, 0);

    // Generate the next counter ID
    const nextCounterId = (maxCounterId + 1).toString().padStart(4, '0');

    setSubStringVal(nextCounterId);

    const uniqueid = Math.random().toFixed(5);
    setCounters([...counters, { counterid: nextCounterId, countername: "", _id: uniqueid, newAdded: true }]);
  }

  function multiCounterInputs(referenceId, reference, inputvalue) {
    if (reference === "counterName") {

      const updatedCounters = counters.map((value, index) => {
        if (referenceId === index) {
          return { ...value, countername: inputvalue };
        } else {
          return value;
        }
      });

      setCounters(updatedCounters); // Update parent state as well
    }
  }

  // Counter delete item of row
  const deleteCounter = (referenceIndex) => {
    let prefixLength = Number(subStringVal) - 1;
    let prefixString = String(prefixLength);
    let rdata = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
    setSubStringVal(rdata);
    let deleteIndex;

    let countData = counters.filter((value, index) => {
      if (referenceIndex != index) {
        return value;
      } else {
        if (counters[index + 1]) {
          deleteIndex = index;
        }
      }
      return false;
    });

    let resultData = countData.map((data, index) => {
      if (index >= deleteIndex) {
        let subcode = data.counterid
        let prefixLength = Number(subcode) - 1;
        let prefixString = String(prefixLength);
        let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString

        return { ...data, counterid: postfixLength, }
      } else {
        return data;
      }
    })
    setCounters(resultData);
  }

  return (
    <Box >
      {counters.length > 0 && (
        <ul type="none" className="todoLlistUl" style={{ paddingLeft: '0px', marginLeft: '0px' }}>
          {counters.map((item, index) => {
            return (
              <li key={index}>
                <br />
                <Grid container columnSpacing={1}>
                  <Grid item sm={12} xs={12} md={5} lg={5}>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        value={item.countername}
                        onChange={(e) => multiCounterInputs(index, "counterName", e.target.value)}
                        type="text"
                        name="categoryname"
                        placeholder="Counter No"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={12} xs={12} md={5} lg={5}>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        value={item.counterid === "" ? "0001" : item.counterid}
                        type="text"
                        name="counterid"
                        placeholder="Counter ID"
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={1} xs={1} md={2} lg={2} sx={{ display: 'flex' }}>
                    <Button variant="contained" color="success" type="button" onClick={() => addCounter()} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><FaPlus /></Button>&nbsp;
                    {index !== 0 && <Button variant="contained" color="error" type="button" onClick={(e) => deleteCounter(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><AiOutlineClose /></Button>}
                  </Grid>
                </Grid>
              </li>
            )
          })}
        </ul>
      )}

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
