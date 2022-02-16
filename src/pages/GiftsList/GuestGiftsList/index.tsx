import React, { useEffect, useState }  from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { GiftListType, GiftType } from '..';

type PropsType = {
  giftList: GiftListType;
};

const GuestGiftsList = ({ giftList }: PropsType) => {
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 2
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" color="text.secondary">
            { giftList.eventName } de
          </Typography>
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            { giftList.hostsName }
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            { giftList.message }
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 4 }} maxWidth="md">
        <Grid container spacing={4}>
          {giftList.gifts.map((gift: GiftType) => (
            <Grid item key={gift.title} xs={12} sm={6} md={4}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={gift.imageUrl}
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" color="text.secondary">
                    {gift.title}
                  </Typography>
                  {
                    gift.gifted && <Chip color="error" size="small" label="Já presenteado" />
                  }
                  
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', pb: 2, px: 2 }}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'end' }}>
                    <Tooltip title="ETH" placement="top" arrow>
                      <SvgIcon viewBox="0 0 33 53" width="20" height="40">
                        <path d="M16.3576 0.666687L16.0095 1.85009V36.1896L16.3576 36.5371L32.2976 27.115L16.3576 0.666687Z" fill="#343434"/>
                        <path d="M16.3578 0.666687L0.417816 27.115L16.3578 36.5372V19.8699V0.666687Z" fill="#8C8C8C"/>
                        <path d="M16.3575 39.5552L16.1613 39.7944V52.0268L16.3575 52.6L32.307 30.1378L16.3575 39.5552Z" fill="#3C3C3B"/>
                        <path d="M16.3578 52.5998V39.5551L0.417816 30.1377L16.3578 52.5998Z" fill="#8C8C8C"/>
                        <path d="M16.3575 36.537L32.2973 27.1151L16.3575 19.8699V36.537Z" fill="#141414"/>
                        <path d="M0.417816 27.1151L16.3576 36.537V19.8699L0.417816 27.1151Z" fill="#393939"/>
                      </SvgIcon>
                    </Tooltip>
                    
                    <Typography variant="h6">
                      {gift.price}
                    </Typography>
                  </Stack>
                  <Button variant="contained" disabled={gift.gifted}>
                    Presentear
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );

};

export { GuestGiftsList };