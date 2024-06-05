import * as React from 'react';
import Layoutadmin from '../../layout/Layoutadmin';
import Typography from '@mui/material/Typography';
import EnhancedTable from '../../components/EnhancedTable';
import EquipmentTable from '../../components/EquipmentTable';




export default function EquipmentData(){
    

    return(
        <Layoutadmin>
            <Typography sx={{ fontSize: '60px', textAlign: 'center', color: '#1D3461', marginBottom: '20px' }}>
              Equipment Data
            </Typography>

          {/* <EnhancedTable /> */}
          <EquipmentTable/>

      
      </Layoutadmin>
    );
}