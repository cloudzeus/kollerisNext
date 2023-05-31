const validationRules = { required: true };
const pageSettings = { pageCount: 5 };
const loadingIndicator = { indicatorType: 'Shimmer' }
const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search', ];
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export  {
    validationRules,
    pageSettings,
    loadingIndicator,
    editOptions,
    toolbarOptions,
    AddIcon,
    EditIcon,
    DeleteIcon,
}