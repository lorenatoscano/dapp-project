import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { WalletContext } from '../../../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

type DialogProps = {
  showDialog: boolean;
  handleCloseDialog: () => void;
};

const CreateListDialog = ({ showDialog, handleCloseDialog }: DialogProps) => {
  const [eventDate, setEventDate] = useState(null);
  const [hostsName, setHostsName] = useState('');
  const [eventName, setEventName] = useState('');
  const [message, setMessage] = useState('');

  const { giftListContract, currentAccount } = useContext(WalletContext);
  const navigate = useNavigate();

  const createList = async () => {
    // Faz a transação para adicionar a lista ao contrato
    if (eventDate !== null) {
      const formatedDate = `${new Date(eventDate).getDay()}/${new Date(eventDate).getMonth()}/${new Date(eventDate).getFullYear()}`;
      try {
        await giftListContract.methods.createNewList(hostsName, formatedDate, eventName, message).send({ from: currentAccount });
        navigate(currentAccount);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Dialog open={showDialog} onClose={handleCloseDialog} fullWidth>
      <DialogTitle>Preencha as informações abaixo:</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            id="hosts-name"
            value={hostsName}
            onChange={(event) => setHostsName(event.target.value)}
            required
            autoFocus
            margin="dense"
            label="Nome dos anfitriões"
            fullWidth
            variant="outlined"
            placeholder="Ex: João e Maria"
          />
          <TextField
            id="event-name"
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
            required
            margin="dense"
            label="Nome do evento"
            fullWidth
            variant="outlined"
            placeholder="Ex: Casamento, Chá de bebê..."
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
            <DatePicker
              label="Data do evento"
              value={eventDate}
              onChange={(newDate) => setEventDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            multiline
            rows={2}
            margin="dense"
            label="Mensagem aos convidados"
            fullWidth
            variant="outlined"
            placeholder="Digite uma mensagem para os seus convidados."
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={handleCloseDialog}>Cancelar</Button>
        <Button variant="contained" onClick={createList}>Criar lista</Button>
      </DialogActions>
    </Dialog>
  );

};

export { CreateListDialog };