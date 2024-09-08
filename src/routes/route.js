// components
import Mail from '../components/mail/Mail';
import Analysis from '../app/parse/Analysis';
import Invoices from '../app/request/Invoices';
import Expenses from '../app/expenses/Expenses';
import Timesheet from '../app/timesheet/Timesheet';
import Interface from '../components/interface/Interface';
import SalesManagement from '../app/sales/SalesManagement';
import ProductManagement from '../app/product/ProductManagement';
import Registration from '../components/registration/Registration';
import CustomerManagement from '../app/customer/CustomerManagement';
import EmployeeManagement from '../app/employee/EmployeeManagement';
import InventoryManagement from '../app/inventory/InventoryManagement';
import InterfaceJS from '../components/interface-job-seeker/InterfaceJobSeeker';
import InterfaceJP from '../components/interface-job-poster/InterfaceJobPoster';
import RegistrationJS from '../components/registration-job-seeker/RegistrationJobSeeker';

// All Labo
import InterfaceRabo from '../components/interface-rabo/InterfaceRabo';
import ProjectStageRabo from '../components/project-stage-rabo/ProjectStageRabo';

// component test
import ComponentTest from '../components/component-tester/ComponentTest';

export const route = [
  {
    name: 'Interface',
    path: '/interface',
    components: Interface,
  },
  {
    name: 'InterfaceJS',
    path: '/interface-js',
    components: InterfaceJS,
  },
  {
    name: 'InterfaceJP',
    path: '/interface-jp',
    components: InterfaceJP,
  },
  {
    name: 'InterfaceRabo',
    path: '/interface-rb',
    components: InterfaceRabo,
  },
  {
    name: 'ProjectStageRabo',
    path: '/projectstage-rb',
    components: ProjectStageRabo,
  },
  {
    name: 'RegistrationJS',
    path: '/registration-js',
    components: RegistrationJS,
  },
  {
    name: 'CustomerManagement',
    path: '/customer-management',
    components: CustomerManagement,
  },
  {
    name: 'SalesManagement',
    path: '/sales-management',
    components: SalesManagement,
  },
  {
    name: 'EmployeeManagement',
    path: '/employee-management',
    components: EmployeeManagement,
  },
  {
    name: 'Invoices',
    path: '/invoices',
    components: Invoices,
  },
  {
    name: 'Analysis',
    path: '/analysis',
    components: Analysis,
  },
  {
    name: 'Timesheet',
    path: '/timesheet',
    components: Timesheet,
  },
  {
    name: 'InventoryManagement',
    path: '/inventory-management',
    components: InventoryManagement,
  },
  {
    name: 'ProductManagement',
    path: '/product-management',
    components: ProductManagement,
  },
  {
    name: 'Expenses',
    path: '/expenses',
    components: Expenses,
  },
  {
    name: 'Registration',
    path: '/registration-old',
    components: Registration,
  },
  {
    name: 'Mail',
    path: '/mail',
    components: Mail,
  },
  {
    name: 'ComponentTest',
    path: '/ct',
    components: ComponentTest,
  },
];
