import * as React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import AdminLayout from 'src/layouts/Admin/AdminLayout';

function RemoteData() {
  const dataManager = new DataManager({
    url: 'https://services.syncfusion.com/react/production/api/schedule',
    adaptor: new WebApiAdaptor,
    crossDomain: true
  });
  return (
    <AdminLayout>
     
            <ScheduleComponent width='100%' height='650px' currentView='Month' eventSettings={{ dataSource: dataManager }} readonly={true}>
              <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent>
     
    </AdminLayout>
  );
}



export default RemoteData;