import React, { useContext, useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CircularProgress } from '@mui/material';
import { WalletContext } from '../../contexts/WalletContext';
import { CreateListDialog } from './CreateListDialog';
import giftsImg from '../../assets/Gifts-amico.svg';

export type GiftType = {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
  gifted: boolean;
  gifter: string;
};

export type GiftListType = {
  eventName: string;
  hostsName: string;
  eventDate: string;
  message: string;
  ownerAddress: string;
  gifts: Array<GiftType>
};

const Home = () => {
  const { returnAllLists, isInitialized, load, triggerAlert, currentAccount } = useContext(WalletContext);

  const [showDialog, setShowDialog] = useState(false);
  const [allLists, setAllLists] = useState<GiftListType[]>([]);
  const [isLoading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const handleCreateList = async () => {
    if (!isInitialized) {
      await load();
    }

    setShowDialog(true);
  }

  const handleManageList = async() => {
    if (!isInitialized) {
      await load();
    }

    const targetList = allLists.find(list => list.ownerAddress.toUpperCase() === currentAccount.toUpperCase());

    if (targetList) {
      navigate(targetList.ownerAddress);
    } else {
      triggerAlert('Nenhuma lista registrada para esta conta! Crie uma lista');
    }
  }

  const handleAccessList = async (address: string) => {
    if (!isInitialized) {
      await load();
    }
    navigate(address);
  }

  const getAllLists = async() => {
    try {
      const lists = await returnAllLists();
      const eventsList = [];
      for (const list of lists) {
        const { 
          eventName,
          hostsName,
          eventDate,
          ownerAddress,
          gifts,
          message
        } : GiftListType = list;
        
        eventsList.push({
          eventName,
          hostsName,
          eventDate,
          ownerAddress,
          gifts,
          message
        });
      }

      setAllLists(eventsList);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    getAllLists();
  }, []);

  return (
    <>
      <CreateListDialog showDialog={showDialog} handleCloseDialog={() => setShowDialog(false)} />
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid item xs={12} md={6} component="section" sx={{ bgcolor: 'background.paper', display: { xs: 'none', md: 'block'} }}>
          <Stack justifyContent="center" alignItems="center" sx={{ height: '100%', pt: 8, pb: 2 }}>
            <img src={giftsImg} alt="Ilustração de presentes" width="70%" />
            
            <Typography 
              component="h1" 
              variant="h4" 
              align="center" 
              sx={{ flexGrow: 1, fontWeight: 500, maxWidth: 450 }} 
              color="text.secondary"
              gutterBottom
            >
              Crie sua lista de presentes na rede Ethereum
            </Typography>
          </Stack>
          
        </Grid>
        <Grid item xs={12} md={6} component="section" style={{ paddingTop: '10%' }} sx={{ height: '100%', overflowY: 'auto' }}>
          <Container maxWidth="sm">
            <Box sx={{ mb: 8 }}>
              <Typography component="h2" variant="h4" align="center" gutterBottom>
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
              <Typography component="h2" variant="h4" align="center" gutterBottom>
                Quero presentear
              </Typography>
              { isLoading 
                ? (
                  <Stack alignItems="center">
                    <CircularProgress />
                  </Stack>
                ) : allLists.length > 0 
                  ? (
                    <List>
                      {
                        allLists.map((giftList) => (
                          <ListItem
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="Acessar lista"
                                onClick={() => handleAccessList(giftList.ownerAddress)}
                              >
                                <RedeemIcon color="primary" />
                              </IconButton>
                            }
                            key={giftList.ownerAddress}
                          >
                            <ListItemText
                              primary={`${giftList.eventName} de ${giftList.hostsName}`}
                              secondary={giftList.eventDate}
                            />
                          </ListItem>
                        ))
                      }
                    </List>
                  ) : (
                    <Typography align="center" gutterBottom>
                      Ainda não existem listas de presentes cadastradas.
                    </Typography>
                  )
              }
            </Box>
          </Container>
        </Grid>
      </Grid> 
    </>
  );
};

export { Home };