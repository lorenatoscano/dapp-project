import React, { useContext, useEffect, useState }  from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import RedeemIcon from '@mui/icons-material/Redeem';
import { WalletContext } from '../../contexts/WalletContext';
import { CreateListDialog } from './CreateListDialog';

const lists = [
  { 
    eventName: 'Casamento',
    hostsName: 'Fulano e Cicrano',
    eventDate: 'dd/mm/aaaa',
    id: '13141'
  },
  { 
    eventName: 'Chá de bebê',
    hostsName: 'Fulana',
    eventDate: 'dd/mm/aaaa',
    id: '1423'
  },
  { 
    eventName: 'Chá de casa nova',
    hostsName: 'Cicrana',
    eventDate: 'dd/mm/aaaa',
    id: '13151'
  }
];

const Home = () => {
  const { load, checkIfWalletIsConnected } = useContext(WalletContext);
  const [showDialog, setShowDialog] = useState(false);
  

  const handleCreateList = async () => {
    if (await checkIfWalletIsConnected()) {
      setShowDialog(true);
    }
  }

  const handleManageList = () => {
    console.log('Gerenciar lista');
  }

  const handleAccessList = (id: string) => {
    console.log('Acessar lista', id);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <CreateListDialog showDialog={showDialog} handleCloseDialog={() => setShowDialog(false)} />
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Quero criar uma lista
            </Typography>
            <Stack
              sx={{ pt: 2 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleCreateList}>
                    Criar minha lista
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleManageList}>
                    Gerenciar minha lista
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Quero presentear
            </Typography>
            <List>
              {
                lists.map((giftList) => (
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="Acessar lista"
                        onClick={() => handleAccessList(giftList.id)}
                      >
                        <RedeemIcon color="primary" />
                      </IconButton>
                    }
                    key={giftList.id}
                  >
                    <ListItemText
                      primary={`${giftList.eventName} de ${giftList.hostsName}`}
                      secondary={giftList.eventDate}
                    />
                  </ListItem>
                ))
              }
            </List>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export { Home };