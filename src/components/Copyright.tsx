import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="#">
        &Sigma; Grindset
      </MuiLink>{' '}
      {new Date().getFullYear()}.
      <MuiLink color={"inherit"} href="https://www.flaticon.com/free-icons/shapes-and-symbols" title="shapes and symbols icons">Shapes and symbols icons created by ArtBit - Flaticon</MuiLink>
    </Typography>
  );
}
