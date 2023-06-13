const validationRules = { required: true };
const pageSettings = { pageCount: 5 };
const loadingIndicator = { indicatorType: 'Shimmer' }
const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
const toolbarOptions = [ 'Search', 'ExcelExport' ];
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
export  {
    validationRules,
    pageSettings,
    loadingIndicator,
    editOptions,
    toolbarOptions,
    AddIcon,
    EditIcon,
    DeleteIcon,
    SyncIcon
}