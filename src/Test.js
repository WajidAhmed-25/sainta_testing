import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Base Chart Settings
const LineChartComponent = ({ data, options }) => {
  // if options is not specified, replace with below
  if (!options) {
    options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
  }

  return <Line data={data} options={options} />;
};

// Now for Radar Chart
const RadarChartComponent = ({ data, options }) => {
  // if options is not specified, replace with below
  if (!options) {
    options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
  }

  return <Radar data={data} options={options} />;
};

// Now for bar chart
const BarChartComponent = ({ data, options }) => {
  // if options is not specified, replace with below
  if (!options) {
    options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
  }

  return <Bar data={data} options={options} />;
};

// Now for pie chart
const PieChartComponent = ({ data, options }) => {
  // if options is not specified, replace with below
  if (!options) {
    options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
  }

  return <Pie data={data} options={options} />;
};

const sampleData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '売上',
      data: [12, 19, 3, 5, 2, 3],
      fill: true,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.33,
    },
  ],
};

const sampleOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5,
      },
    },
  },
};

const Test = ({
  currentUser,
  customers,
  products,
  invoices,
  inventory,
  employees,
  expenses,
  expenseCategories,
  leadInfo,
}) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/interface');
  };

  const [selectedCustomAnalysis, setSelectedCustomAnalysis] = useState(null);

  // Functions (Will put this in a separate file later)
  // Placeholder function that should calculate the product cost
  const unitConversions = {
    g: 1, // grams to grams
    kg: 1000, // kilograms to grams
    mg: 1 / 1000, // milligrams to grams
    ml: 1, // milliliters to milliliters
    L: 1000, // liters to milliliters
  };

  // Convert the volume value from the specified unit to grams or milliliters
  const convertToBaseUnit = (value, unit) => {
    return value * (unitConversions[unit] || 1);
  };

  const calculateProductCost = product => {
    if (product && product.productCost) {
      return product.productCost;
    } else if (product && product.inventoryUsed) {
      return product.inventoryUsed.reduce((totalCost, itemUsage) => {
        const inventoryItem = inventory.find(
          invItem => invItem.id === itemUsage.id,
        );

        if (inventoryItem) {
          // Convert both the used volume and the item's volume per item to the same unit before calculating the cost
          const usedVolumeInBaseUnit = convertToBaseUnit(
            itemUsage.volumeUsed,
            itemUsage.volumeUnit,
          );
          const volumePerItemInBaseUnit = convertToBaseUnit(
            inventoryItem.volumePerItem,
            inventoryItem.volumeUnit,
          );

          // Now calculate the cost proportionally
          const costForUsedVolume =
            (usedVolumeInBaseUnit / volumePerItemInBaseUnit) *
            inventoryItem.costPrice;

          let newCost;
          newCost = totalCost + costForUsedVolume;
          newCost = Math.round((newCost + Number.EPSILON) * 100) / 100;
          return newCost;
        }

        // round to 2 decimal places
        return totalCost;
      }, 0);
    }
    return 0;
  };

  // Types of analysis: "product", "customer", "employee", "expense"
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(null);
  const [selectedAnalysisSubType, setSelectedAnalysisSubType] = useState(null);

  // Now, for products, selectedProduct
  const [selectedProduct, setSelectedProduct] = useState(products[0]); // Default to the first product in the list
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to the current month
  const [selectedGender, setSelectedGender] = useState('男性'); // Can be "男性", "女性", or "男女"
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to the current date

  // Now for budgetAmount, budgetCategory
  const [budgetAmount, setBudgetAmount] = useState(100000); // Default to 100,000 yen
  const [budgetCategory, setBudgetCategory] = useState('旅費交通'); // Default to 旅費交通

  // To fix the dropDown DatePicker
  const setTheMonth = date => {
    setSelectedDate(date);
    setSelectedMonth(date.getMonth() + 1);
  };

  // Helper function to determine which week a date falls in
  const getWeekOfMonth = date => {
    const firstDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
    ).getDay();
    const dayOffset = date.getDate() + firstDayOfMonth - 1; // -1 to make the count 0-indexed
    return Math.ceil(dayOffset / 7);
  };

  // Now, the analysis function for the product analysis (including all five subtypes), use all data in the states above to calculate the analysis
  const calculateProductAnalysis = (
    invoices,
    products,
    inventory,
    selectedAnalysisSubType,
    selectedProduct,
    selectedMonth,
    selectedGender,
  ) => {
    if (selectedAnalysisSubType === 'gender_products') {
      // Define the weekly sales structure
      let weeklySales = {};

      invoices.forEach(invoice => {
        const invoiceDate = new Date(invoice.invoice_date);
        if (invoiceDate.getMonth() + 1 === selectedMonth) {
          // JS months are 0-indexed
          invoice.invoice_items.forEach(item => {
            if (item.product_id === selectedProduct.id) {
              const week = getWeekOfMonth(invoiceDate);
              const weekKey = `week_${week}`;

              if (!weeklySales[weekKey]) {
                // Define week if it doesn't exist
                weeklySales[weekKey] = { M: 0, F: 0 };
              }

              console.log(item.male_count, item.female_count);

              weeklySales[weekKey].M += item.male_count;
              weeklySales[weekKey].F += item.female_count;
            }
          });
        }
      });

      // Transform weeklySales into the data array required for Chart.js
      const labels = ['第一週', '第二週', '第三週', '第四週'];
      const maleData = Object.values(weeklySales).map(week => week.M);
      const femaleData = Object.values(weeklySales).map(week => week.F);

      // Chart.js data object
      const chartData = {
        labels: labels,
        datasets: [],
      };

      // Check if we need to include men's sales, women's, or both
      if (selectedGender === '男性') {
        chartData.datasets.push({
          label: '男性',
          data: maleData,
          fill: true,
          borderColor: '#464a91',
          backgroundColor: 'rgba(70, 74, 145, 0.2)',
          tension: 0.33,
        });
      } else if (selectedGender === '女性') {
        chartData.datasets.push({
          label: '女性',
          data: femaleData,
          fill: true,
          borderColor: '#e91e63',
          backgroundColor: 'rgba(233, 30, 99, 0.2)',
          tension: 0.33,
        });
      } else {
        chartData.datasets.push(
          {
            label: '男性',
            data: maleData,
            fill: true,
            borderColor: '#464a91',
            backgroundColor: 'rgba(70, 74, 145, 0.2)',
            tension: 0.33,
          },
          {
            label: '女性',
            data: femaleData,
            fill: true,
            borderColor: '#e91e63',
            backgroundColor: 'rgba(233, 30, 99, 0.2)',
            tension: 0.33,
          },
        );
      }

      return <LineChartComponent data={chartData} />;
    } else if (selectedAnalysisSubType === 'costefficient_products') {
      // NEXT MODULE: Cost-Efficient Products per 4 Week Schedule – Sales Per Week from Products Object – Product Cost from Inventory Object

      // Define the weekly sales structure
      const productCost = calculateProductCost(selectedProduct, inventory);
      // Define the weekly sales structure
      let weeklySales = {};

      invoices.forEach(invoice => {
        const invoiceDate = new Date(invoice.invoice_date);
        if (invoiceDate.getMonth() + 1 === selectedMonth) {
          // JS months are 0-indexed
          invoice.invoice_items.forEach(item => {
            if (item.product_id === selectedProduct.id) {
              const week = getWeekOfMonth(invoiceDate);
              const weekKey = `week_${week}`;

              if (!weeklySales[weekKey]) {
                // Define week if it doesn't exist
                weeklySales[weekKey] = 0;
              }

              weeklySales[weekKey] += item.quantity;
            }
          });
        }
      });

      // Now, calculate the profit margin for each week
      let weeklyProfitMargin = {};

      Object.keys(weeklySales).forEach(weekKey => {
        const weekSales = weeklySales[weekKey];
        const weekProfit =
          weekSales * (selectedProduct.productPrice - productCost);
        const profitMarginPercentage =
          (weekProfit / (weekSales * selectedProduct.productPrice)) * 100; // want this
        const roiPercentage = (weekProfit / (productCost * weekSales)) * 100; // want this

        weeklyProfitMargin[weekKey] = {
          profitMarginPercentage: profitMarginPercentage.toFixed(2), // rounded to 2 decimal points
          roiPercentage: roiPercentage.toFixed(2), // rounded to 2 decimal points
          rawProfit: weekProfit,
          totalSales: weekSales,
        };
      });

      // Transform weeklySales into the data array required for Chart.js
      const labels = ['第一週', '第二週', '第三週', '第四週'];
      const profitMarginData = Object.values(weeklyProfitMargin);

      // max of the max for profitMarginPercentage and roiPercentage
      const maxProfitMargin = Math.max(
        ...profitMarginData.map(week => week.profitMarginPercentage),
      );
      const maxROI = Math.max(
        ...profitMarginData.map(week => week.roiPercentage),
      );
      const max = Math.max(maxProfitMargin, maxROI);
      // Push that up by 1.25
      const yMax = max * 1.25;

      // Chart.js data object
      const chartData = {
        labels: labels,
        datasets: [],
      };

      chartData.datasets.push({
        label: '利益率 (%)',
        data: profitMarginData.map(week => week.profitMarginPercentage),
        fill: true,
        borderColor: '#25b840',
        backgroundColor: 'rgba(37, 184, 64, 0.2)',
        tension: 0.33,
      });
      chartData.datasets.push({
        label: '投資収益率 (%)',
        data: profitMarginData.map(week => week.roiPercentage),
        fill: true,
        borderColor: '#e89851',
        backgroundColor: 'rgba(232, 152, 81, 0.2)',
        tension: 0.33,
      });

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            max: yMax,
            beginAtZero: true,
            ticks: {
              stepSize: 5,
            },
          },
        },
      };

      return <LineChartComponent data={chartData} options={options} />;
    }
    // now for seasonal_products
    else if (selectedAnalysisSubType === 'seasonal_products') {
      // Define the dates for each season
      // Seasons= { '春': [3, 4, 5], '夏': [6, 7, 8], '秋': [9, 10, 11], '冬': [12, 1, 2] }; (month)
      const seasons = {
        春: [3, 4, 5],
        夏: [6, 7, 8],
        秋: [9, 10, 11],
        冬: [12, 1, 2],
      };

      // Define the seasonal sales structure (start with fuyu) -> { '冬': 0, '春': 0, '夏': 0, '秋': 0 }
      let seasonalSales = {};
      Object.keys(seasons).forEach(season => {
        seasonalSales[season] = 0;
      });

      // Now, calculate the sales for each season based on the current selected product
      // Basically if the month === 3, 4, or 5, add the sales to 春, et cetera
      // We DONOT use the selected month, rather we use the year of the selectedDate
      invoices.forEach(invoice => {
        const invoiceDate = new Date(invoice.invoice_date);
        if (invoiceDate.getFullYear() === selectedDate.getFullYear()) {
          invoice.invoice_items.forEach(item => {
            if (item.product_id === selectedProduct.id) {
              Object.keys(seasons).forEach(season => {
                if (seasons[season].includes(invoiceDate.getMonth() + 1)) {
                  seasonalSales[season] += item.quantity;
                }
              });
            }
          });
        }
      });

      // Transform seasonalSales into the data array required for Chart.js
      const labels = Object.keys(seasons);
      const data = Object.values(seasonalSales);

      // Chart.js data object
      const chartData = {
        labels: labels,
        datasets: [],
      };

      chartData.datasets.push({
        label: '売上',
        data: data,
        fill: true,
        borderColor: '#6aafc4',
        backgroundColor: 'rgba(106, 175, 196, 0.2)',
        tension: 0.33,
      });

      return <LineChartComponent data={chartData} />;
    }

    // ... Additional code for other analysis subtypes would go here ...

    // Default return if the selected subtype is not handled
    return null;
  };

  // Now for sales analysis, taking in leadInfo, employees, customers, products, invoices
  const calculateSalesAnalysis = (
    leadInfo,
    employees,
    customers,
    products,
    invoices,
    selectedAnalysisSubType,
  ) => {
    // First we start with lead_employee
    if (selectedAnalysisSubType === 'lead_employee') {
      // We first aggregate leads linked to each employee (salesperson) but since we can have custom 部署 we just aggregate all employees leads converted
      // We will iterate through the leads and just see the employee_id the lead is linked to, then if that is not part of the current emplyoee list of
      // our array, we will add it, and then mark the leads assigned and then leads converted. We will make it into a bar chart and the key is the
      // employee's fullName variable, and the value is the percentage of the leads converted against the leads assigned (which is a lead of any stage)
      // that isn't success.
      let employeeList = {}; // the employee list of each employee that has even a lead assigned to them

      // Now, we will iterate through the leadInfo and see if the employee_id is in the employeeList, if not, we will add it, and then we will
      // add the leads assigned to that employee, and then we will add the leads converted to that employee
      leadInfo.forEach(lead => {
        if (lead.employee_id) {
          if (!employeeList[lead.employee_id]) {
            // We will add the employee to the employeeList
            employeeList[lead.employee_id] = {
              leads_assigned: 0,
              leads_converted: 0,
            };
          }

          employeeList[lead.employee_id].leads_assigned += 1;

          if (lead.status === '成約') {
            employeeList[lead.employee_id].leads_converted += 1;
          }
        }
      });

      // Transform employeeList into the data array required for Chart.js -> will be a bar chart
      // Make the labels into the employee's fullName, and the data into the percentage of leads converted
      let labels = [];
      let convertedPercentage = [];

      // Generate data for the chart based on the employeeList
      Object.keys(employeeList).forEach(employee => {
        const employeeInfo = employees.find(
          emp => emp.id === parseInt(employee),
        );
        if (employeeInfo) {
          labels.push(employeeInfo.fullName);
          convertedPercentage.push(
            (employeeList[employee].leads_converted /
              employeeList[employee].leads_assigned) *
              100,
          );
        }
      });

      // Now we will make a colors and backgroundColors array for up to 5 employees, then the rest will be grey
      // #80aeed, #80dfed, #80edb8, #a6ed80, #dde8d8
      const colors = ['#80aeed', '#80dfed', '#80edb8', '#a6ed80', '#dde8d8'];
      const bgcolors = [
        'rgba(128, 174, 237, 1)',
        'rgba(128, 223, 237, 1)',
        'rgba(128, 237, 184, 1)',
        'rgba(166, 237, 128, 1)',
        'rgba(221, 232, 216, 1)',
      ];

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'リード転換率 (%)',
            data: convertedPercentage,
            backgroundColor: bgcolors,
            borderColor: colors,
            borderWidth: 1,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
            },
          },
        },
      };

      return <BarChartComponent data={chartData} options={options} />;
    } else if (selectedAnalysisSubType === 'lead_customer') {
      // We will make a radar chart with the customers as the labels, and the data will be the percentage of leads converted
      // We will iterate through the leadInfo and see if the customer_id is in the customerList, and then grab the total of all the leads and divide
      let customerList = {};

      // leadInfo.customer_id is the property that we will use to get the customer_id of the lead
      leadInfo.forEach(lead => {
        if (lead.customer_id) {
          if (!customerList[lead.customer_id]) {
            customerList[lead.customer_id] = {
              leads_assigned: 0,
              leads_converted: 0,
            };
          }

          customerList[lead.customer_id].leads_assigned += 1;

          if (lead.status === '成約') {
            customerList[lead.customer_id].leads_converted += 1;
          }
        }
      });

      // Now, we will make the labels and the data
      let labels = [];
      let data = [];

      Object.keys(customerList).forEach(customer => {
        const customerInfo = customers.find(
          cust => cust.id === parseInt(customer),
        );
        if (customerInfo) {
          labels.push(customerInfo.name);
          data.push(
            (customerList[customer].leads_converted /
              customerList[customer].leads_assigned) *
              100,
          );
        }
      });

      // Now we use the RadarChartComponent
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'リード獲得成功率 (%)',
            data: data,
            backgroundColor: 'rgba(227, 23, 23, 0.2)',
            borderColor: '#e31717',
            borderWidth: 1,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 20,
            },
          },
        },
      };

      return <RadarChartComponent data={chartData} options={options} />;
    } else if (selectedAnalysisSubType === 'lead_total') {
      // We will make a radar chart with the stages of the leads as the labels, and the data will be the percentage of leads in that stage
      // We will iterate through the leadInfo and see if the status is in the leadStatus, and then grab the total of all the leads and divide
      let total_leads = 0;
      let leadStatusList = {};

      // leadInfo.status is the property that we will use to get the status of the lead
      leadInfo.forEach(lead => {
        if (lead.status) {
          if (!leadStatusList[lead.status]) {
            leadStatusList[lead.status] = 0;
          }

          leadStatusList[lead.status] += 1;
          total_leads += 1;
        }
      });

      // Now, we will make the labels and the data
      let labels = [];
      let data = [];

      Object.keys(leadStatusList).forEach(status => {
        labels.push(status);
        data.push((leadStatusList[status] / total_leads) * 100);
      });

      // Now we use the RadarChartComponent #eb8638
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'リード段階 (%)',
            data: data,
            backgroundColor: 'rgba(235, 134, 56, 0.2)',
            borderColor: '#eb8638',
            borderWidth: 1,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
            },
          },
        },
      };

      return <RadarChartComponent data={chartData} options={options} />;
    }

    // Return null if the selected subtype is not handled
    return null;
  };

  /*### 1. Categorical Expenditure Breakdown (Yearly)
- **Why Yearly**: Yearly provides a broader view, useful for strategic planning and annual budget adjustments. It allows for understanding seasonal variations and yearly spending trends within each category without getting lost in the noise of monthly fluctuations.
- **Feature Insight**: The ERP system will aggregate expenses by category over the year and present a visual (e.g., pie chart, bar graph) and numeric breakdown. This can help in identifying areas where spending is highest and opportunities for cost savings.

### 2. Trend Analysis (Monthly)
- **Why Monthly**: Monthly trend analysis offers a more granular look at spending habits, allowing for quicker response to unexpected changes in expenditure or revenue. It’s ideal for operational adjustments and short-term financial planning.
- **Feature Insight**: Analyze and display monthly spending trends over a selected period (e.g., 12 months). This can be visualized using line graphs to illustrate how expenses in key categories fluctuate over time, helping to predict future spending and adjust strategies accordingly.

### 3. Budget Efficiency Analysis
- **Feature Concept**: Given a budget and a timeframe (e.g., monthly, quarterly, yearly), the ERP software will calculate the proportion of the budget consumed by actual expenses, predict future expense trends within the same timeframe, and suggest adjustments or forecast potential over/under spending.
- **Functionality**: 
    - **Input**: The user enters a total budget amount in Yen and selects a timeframe.
    - **Process**: The software calculates total expenses incurred within the selected timeframe and uses trend analysis to predict future spending before the end of the budget period.
    - **Output**: The system displays:
        - The percentage of the budget already spent.
        - Projected total expenditure by the end of the period based on current trends.
        - Advice on whether to cut back on spending or if there's leeway for additional expenditures to remain within budget.
    - **Benefit**: This feature helps maintain financial discipline, providing a proactive approach to managing expenses against budget constraints. It can alert users early if spending is trending above budget, allowing for timely corrective actions.
*/

  // Now for expenses analysis, taking in expenses, expenseCategories, selectedAnalysisSubType
  // Takes in budgetCategory state, budgetAmount state
  const calculateExpenseAnalysis = expenses => {
    // First we start with categorical_expenses
    // We are doing a per year basis which splits by seasons in categorical_expenses
    if (selectedAnalysisSubType === 'categorical_expenses') {
      // We are going to make this into a per-season basis, so we will make a dictionary of the seasons
      // Seasons= { '春': [3, 4, 5], '夏': [6, 7, 8], '秋': [9, 10, 11], '冬': [12, 1, 2] }; (month)
      const seasons = {
        春: [3, 4, 5],
        夏: [6, 7, 8],
        秋: [9, 10, 11],
        冬: [12, 1, 2],
      };

      // Define the seasonal sales structure (start with fuyu) -> { '冬': 0, '春': 0, '夏': 0, '秋': 0 }
      let seasonalExpenses = {};
      Object.keys(seasons).forEach(season => {
        seasonalExpenses[season] = 0;
      });

      // Now, calculate the expenses for each season based on the current selected expenseCategory.
      // Basically if the month === 3, 4, or 5, add the expenses to 春, et cetera
      // We DONOT use the selected month, rather we use the year of the selectedDate
      let year = selectedDate.getFullYear();

      // Each expense has a incurredDate property, which is a Date object. We will use that to get the month and year
      // Make sure it's the same budgetCategory as the selected one
      expenses.forEach(expense => {
        console.log(expense.incurredDate, expense.category, budgetCategory);
        if (expense.incurredDate && expense.category === budgetCategory) {
          const expenseDate = expense.incurredDate;
          if (expenseDate.getFullYear() === year) {
            Object.keys(seasons).forEach(season => {
              if (seasons[season].includes(expenseDate.getMonth() + 1)) {
                seasonalExpenses[season] += parseInt(expense.cost);
              }
            });
          }
        }
      });

      // We will use a pie chart and make every season into a different color slice
      // We will make the labels as the season, and hte data as the expense cost
      let labels = [];
      let data = [];

      Object.keys(seasonalExpenses).forEach(season => {
        labels.push(season);
        data.push(seasonalExpenses[season]);
      });

      // Now we use the PieChartComponent
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: '支出 (¥)',
            data: data,
            backgroundColor: [
              'rgba(50, 184, 85, 0.2)',
              'rgba(209, 206, 13, 0.2)',
              'rgba(212, 119, 13, 0.2)',
              'rgba(66, 180, 214, 0.2)',
            ],
            borderColor: ['#32b855', '#d1ce0d', '#d4770d', '#42b4d6'],
            borderWidth: 1.25,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
      };

      return <PieChartComponent data={chartData} options={options} />;
    } else if (selectedAnalysisSubType === 'trend_analysis') {
      // We are going to make a line chart with the month selected and divide by 4 weeks
      // We will make the labels as the week, and the data as the expense cost (for all expenses)
      // We will use the selectedMonth and selectedDate
      let weeklyExpenses = {
        week_1: 0,
        week_2: 0,
        week_3: 0,
        week_4: 0,
      };

      // We will iterate through the expenses and see if the incurredDate is in the selectedMonth, and then we will add the expenses to the weeklyExpenses
      // We will add the total expense cost for each week
      expenses.forEach(expense => {
        if (expense.incurredDate) {
          const expenseDate = expense.incurredDate;
          if (expenseDate.getMonth() + 1 === selectedMonth) {
            const week = getWeekOfMonth(expenseDate);
            const weekKey = `week_${week}`;

            weeklyExpenses[weekKey] += parseInt(expense.cost);
          }
        }
      });

      // Transform weeklyExpenses into the data array required for Chart.js
      const labels = ['第一週', '第二週', '第三週', '第四週'];
      const data = Object.values(weeklyExpenses);

      // Chart.js data object
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: '支出 (¥)',
            data: data,
            fill: true,
            borderColor: '#cf7ec2',
            backgroundColor: 'rgba(207, 126, 194, 0.2)',
            tension: 0.33,
            borderWidth: 1.25,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        // min and max for the y axis
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      return <LineChartComponent data={chartData} options={options} />;
    } else if (selectedAnalysisSubType === 'budget_efficiency') {
      // We have a budget amount which we will put against the expenses per that week.
      // We basically have budget remaining and expenses remaining after minusing the expenses from the budget
      // Having a bar with two bars, one for budget remaining (and we will sequentially minus the budget per week of calculation)
      // and one for expenses remaining (and we will sequentially minus the expenses per week of calculation)
      // We will use the selectedMonth and selectedDate
      let weeklyExpenses = {
        week_1: 0,
        week_2: 0,
        week_3: 0,
        week_4: 0,
      };

      let budgetRemaining = budgetAmount;

      let budget_remaining_weekly = {
        week_1: budgetRemaining,
        week_2: budgetRemaining,
        week_3: budgetRemaining,
        week_4: budgetRemaining,
      };

      // We will iterate through the expenses and see if the incurredDate is in the selectedMonth, and then we will add the expenses to the weeklyExpenses
      // We will add the total expense cost for each week
      expenses.forEach(expense => {
        if (expense.incurredDate) {
          const expenseDate = expense.incurredDate;
          if (expenseDate.getMonth() + 1 === selectedMonth) {
            const week = getWeekOfMonth(expenseDate);
            const weekKey = `week_${week}`;

            weeklyExpenses[weekKey] += parseInt(expense.cost);
          }
        }
      });

      // Now, we will calculate the budget_remaining_weekly
      Object.keys(weeklyExpenses).forEach(weekKey => {
        budgetRemaining -= weeklyExpenses[weekKey];
        budget_remaining_weekly[weekKey] = budgetRemaining;
      });

      // Transform weeklyExpenses into the data array required for Chart.js
      const labels = ['第一週', '第二週', '第三週', '第四週'];
      const budgetData = Object.values(budget_remaining_weekly);
      const expenseData = Object.values(weeklyExpenses);

      // Chart.js data object
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: '予算残高 (¥)',
            data: budgetData,
            fill: true,
            borderColor: '#0bbf29',
            backgroundColor: 'rgba(11, 191, 41, 0.2)',
            tension: 0.33,
            borderWidth: 1.25,
          },
          {
            label: '支出残高 (¥)',
            data: expenseData,
            fill: true,
            borderColor: '#c9161f',
            backgroundColor: 'rgba(201, 22, 31, 0.2)',
            tension: 0.33,
            borderWidth: 1.25,
          },
        ],
      };

      // Autocalculate the stepSize for the y axis
      const maxBudget = Math.max(...budgetData);
      const maxExpense = Math.max(...expenseData);
      const max = Math.max(maxBudget, maxExpense);
      let yMax = max * 1.25;
      // round to nearest 1000
      yMax = Math.ceil(yMax / 1000) * 1000;

      // Stepsize is 1/5 of the yMax
      const stepSize = yMax / 5;

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        // min and max for the y axis
        scales: {
          y: {
            beginAtZero: true,
            max: yMax,
            ticks: {
              stepSize: stepSize,
            },
          },
        },
      };

      return <BarChartComponent data={chartData} options={options} />;
    }

    // Return null if the selected subtype is not handled
    return null;
  };

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faChartBar} />
            解析
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      <div className="management-container">
        <div className="list analysis-list">
          <div
            className={
              'list-item ' +
              (selectedAnalysisType === 'product' ? 'selected' : '')
            }
            onClick={() => setSelectedAnalysisType('product')}
          >
            商品分析
          </div>
          <div
            className={
              'list-item ' +
              (selectedAnalysisType === 'sales' ? 'selected' : '')
            }
            onClick={() => setSelectedAnalysisType('sales')}
          >
            営業分析
          </div>
          <div
            className={
              'list-item ' +
              (selectedAnalysisType === 'expenses' ? 'selected' : '')
            }
            onClick={() => setSelectedAnalysisType('expenses')}
          >
            経費分析
          </div>
          {/* custom analysois */}
          <div
            className={
              'list-item ' +
              (selectedAnalysisType === 'custom' ? 'selected' : '')
            }
            onClick={() => setSelectedAnalysisType('custom')}
          >
            カスタム分析
          </div>
        </div>

        {selectedAnalysisType === 'product' && (
          <div className="list analysis-list-product">
            <div
              className={
                'list-item ' +
                (selectedAnalysisSubType === 'gender_products'
                  ? 'selected'
                  : '')
              }
              onClick={() => setSelectedAnalysisSubType('gender_products')}
            >
              男女別人気商品
            </div>
            <div
              className={
                'list-item ' +
                (selectedAnalysisSubType === 'costefficient_products'
                  ? 'selected'
                  : '')
              }
              onClick={() =>
                setSelectedAnalysisSubType('costefficient_products')
              }
            >
              別月次収益性
            </div>
            <div
              className={
                'list-item ' +
                (selectedAnalysisSubType === 'seasonal_products'
                  ? 'selected'
                  : '')
              }
              onClick={() => setSelectedAnalysisSubType('seasonal_products')}
            >
              季節別売上傾向
            </div>
          </div>
        )}

        {/* we will do, sales per employee, leads converted, etc (lead_employee), lead conversion by customer (lead_customer), complete lead analysis (lead_total) which aggregates all leads and shows the stage rates of all leads*/}
        {selectedAnalysisType === 'sales' && (
          <>
            <div className="list analysis-list-sales">
              <div
                className={
                  'list-item ' +
                  (selectedAnalysisSubType === 'lead_employee'
                    ? 'selected'
                    : '')
                }
                onClick={() => setSelectedAnalysisSubType('lead_employee')}
              >
                営業員別リード転換
              </div>
              <div
                className={
                  'list-item ' +
                  (selectedAnalysisSubType === 'lead_customer'
                    ? 'selected'
                    : '')
                }
                onClick={() => setSelectedAnalysisSubType('lead_customer')}
              >
                顧客別リード獲得成功率
              </div>
              <div
                className={
                  'list-item ' +
                  (selectedAnalysisSubType === 'lead_total' ? 'selected' : '')
                }
                onClick={() => setSelectedAnalysisSubType('lead_total')}
              >
                全リード段階分析
              </div>
            </div>
          </>
        )}

        {/* we will do,  categorical expenditure breakdown (yearly), trend analysis (monthly), budget efficiency analysis (budget) */}
        {selectedAnalysisType === 'expenses' && (
          <>
            <div className="list analysis-list-expenses">
              <div
                className={
                  'list-item ' +
                  (selectedAnalysisSubType === 'categorical_expenses'
                    ? 'selected'
                    : '')
                }
                onClick={() =>
                  setSelectedAnalysisSubType('categorical_expenses')
                }
              >
                カテゴリー別支出
              </div>
              <div
                className={
                  'list-item ' +
                  (selectedAnalysisSubType === 'trend_analysis'
                    ? 'selected'
                    : '')
                }
                onClick={() => setSelectedAnalysisSubType('trend_analysis')}
              >
                月次支出傾向
              </div>
              <div
                className={
                  'list-item ' +
                  (selectedAnalysisSubType === 'budget_efficiency'
                    ? 'selected'
                    : '')
                }
                onClick={() => setSelectedAnalysisSubType('budget_efficiency')}
              >
                予算効率
              </div>
            </div>
          </>
        )}

        {/* Now, we will do the actual analysis */}
        {(selectedAnalysisSubType === 'categorical_expenses' ||
          selectedAnalysisSubType === 'trend_analysis' ||
          selectedAnalysisSubType === 'budget_efficiency') && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">データ</h3>

                {/* Categorical Expenses */}
                {selectedAnalysisSubType === 'categorical_expenses' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">カテゴリー別支出</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateExpenseAnalysis(expenses)}
                    </div>
                  </div>
                )}

                {/* Trend Analysis */}
                {selectedAnalysisSubType === 'trend_analysis' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">月次支出傾向</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateExpenseAnalysis(expenses)}
                    </div>
                  </div>
                )}

                {/* Budget Efficiency */}
                {selectedAnalysisSubType === 'budget_efficiency' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">予算効率</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateExpenseAnalysis(expenses)}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-column">
                <h3 className="form-header">分析情報</h3>
                {/* only if categorical is selected, we display the dropdown for all categories */}
                {selectedAnalysisSubType === 'categorical_expenses' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="categoryToAnalyze">カテゴリー</label>
                      <select
                        className="form-control"
                        id="categoryToAnalyze"
                        value={budgetCategory}
                        onChange={event =>
                          setBudgetCategory(event.target.value)
                        }
                      >
                        {expenseCategories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="yearToChoose">年</label>
                      <DatePicker
                        className="form-control"
                        id="yearToChoose"
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        dateFormat="yyyy年"
                        showYearPicker
                        locale="ja"
                      />
                    </div>
                  </>
                )}

                {/* if trend or budget is selected – dropdown of time per month */}
                {(selectedAnalysisSubType === 'trend_analysis' ||
                  selectedAnalysisSubType === 'budget_efficiency') && (
                  <div className="form-group">
                    <label htmlFor="monthOfYearToChoose">月</label>
                    <DatePicker
                      className="form-control"
                      id="monthOfYearToChoose"
                      selected={selectedDate}
                      onChange={date => setTheMonth(date)}
                      dateFormat="yyyy年MM月"
                      showMonthYearPicker
                      locale="ja"
                    />
                  </div>
                )}

                {/* if budget is selected – input for budget amount */}
                {selectedAnalysisSubType === 'budget_efficiency' && (
                  <div className="form-group">
                    <label htmlFor="budgetAmount">
                      予算{' '}
                      <span
                        style={{
                          fontSize: '.75rem',
                          color: '#858585',
                          marginLeft: '5px',
                        }}
                      >
                        {' '}
                        (月)
                      </span>
                    </label>
                    <div className="currency-input-group">
                      <span className="currency-label">¥</span>
                      <input
                        className="form-control"
                        id="budgetAmount"
                        type="number"
                        value={budgetAmount}
                        onChange={event => setBudgetAmount(event.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {(selectedAnalysisSubType === 'lead_employee' ||
          selectedAnalysisSubType === 'lead_customer' ||
          selectedAnalysisSubType === 'lead_total') && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">データ</h3>

                {/* Lead Employee */}
                {selectedAnalysisSubType === 'lead_employee' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">営業員別リード転換</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateSalesAnalysis(
                        leadInfo,
                        employees,
                        customers,
                        products,
                        invoices,
                        selectedAnalysisSubType,
                      )}
                    </div>
                  </div>
                )}

                {/* Lead Product */}
                {selectedAnalysisSubType === 'lead_customer' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">顧客別リード獲得成功率</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateSalesAnalysis(
                        leadInfo,
                        employees,
                        customers,
                        products,
                        invoices,
                        selectedAnalysisSubType,
                      )}
                    </div>
                  </div>
                )}

                {/* Lead Total */}
                {selectedAnalysisSubType === 'lead_total' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">全リード段階分析</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateSalesAnalysis(
                        leadInfo,
                        employees,
                        customers,
                        products,
                        invoices,
                        selectedAnalysisSubType,
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {(selectedAnalysisSubType === 'gender_products' ||
          selectedAnalysisSubType === 'costefficient_products' ||
          selectedAnalysisSubType === 'leastpopular_products' ||
          selectedAnalysisSubType === 'profitmargin_products' ||
          selectedAnalysisSubType === 'seasonal_products') && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">データ</h3>

                {/* Gender Products */}
                {selectedAnalysisSubType === 'gender_products' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">月別人気商品</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateProductAnalysis(
                        invoices,
                        products,
                        inventory,
                        selectedAnalysisSubType,
                        selectedProduct,
                        selectedMonth,
                        selectedGender,
                      )}
                    </div>
                  </div>
                )}

                {/* Cost Efficient Products */}
                {selectedAnalysisSubType === 'costefficient_products' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">月別収益性</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateProductAnalysis(
                        invoices,
                        products,
                        inventory,
                        selectedAnalysisSubType,
                        selectedProduct,
                        selectedMonth,
                        selectedGender,
                      )}
                    </div>
                  </div>
                )}

                {/* Seasonal Products */}
                {selectedAnalysisSubType === 'seasonal_products' && (
                  <div className="form-group" style={{ overflow: 'hidden' }}>
                    <label htmlFor="graph">季節別売上傾向</label>
                    <div
                      style={{
                        height: '20em',
                        width: '100%',
                        marginTop: '.5em',
                      }}
                    >
                      {calculateProductAnalysis(
                        invoices,
                        products,
                        inventory,
                        selectedAnalysisSubType,
                        selectedProduct,
                        selectedMonth,
                        selectedGender,
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-column">
                {/* Current product selection in dropDown of all products */}
                <h3 className="form-header">分析情報</h3>
                {/* productToAnalyze, monthOfYeartoChoose (using datePicker), genderToChoose */}
                <div className="form-group">
                  <label htmlFor="productToAnalyze">商品</label>
                  <select
                    className="form-control"
                    id="productToAnalyze"
                    value={selectedProduct.id}
                    onChange={event =>
                      setSelectedProduct(
                        products.find(
                          product =>
                            product.id === parseInt(event.target.value),
                        ),
                      )
                    }
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.productName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Use datePicker */}
                {selectedAnalysisSubType !== 'seasonal_products' && (
                  <div className="form-group">
                    <label htmlFor="monthOfYearToChoose">月</label>
                    <DatePicker
                      className="form-control"
                      id="monthOfYearToChoose"
                      selected={selectedDate}
                      onChange={date => setTheMonth(date)}
                      dateFormat="yyyy年MM月"
                      showMonthYearPicker
                      locale="ja"
                    />
                  </div>
                )}
                {selectedAnalysisSubType === 'seasonal_products' && (
                  // add a year picker
                  <div className="form-group">
                    <label htmlFor="monthOfYearToChoose">年</label>
                    <DatePicker
                      className="form-control"
                      id="monthOfYearToChoose"
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      dateFormat="yyyy年"
                      showYearPicker
                      locale="ja"
                    />
                  </div>
                )}

                {/* Use dropDown */}
                {selectedAnalysisSubType === 'gender_products' && (
                  <div className="form-group">
                    <label htmlFor="genderToChoose">性別</label>
                    <select
                      className="form-control"
                      id="genderToChoose"
                      value={selectedGender}
                      onChange={event => setSelectedGender(event.target.value)}
                    >
                      <option value="男性">男性</option>
                      <option value="女性">女性</option>
                      <option value="男女">男女</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Add a blank graph thats a line graph on one column and then a control panel to the right */}
        {selectedAnalysisType === 'custom' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">データ</h3>
                <div className="form-group" style={{ overflow: 'hidden' }}>
                  <label htmlFor="graph">カスタム分析</label>
                  <div
                    style={{
                      height: '20em',
                      width: '100%',
                      marginTop: '.5em',
                    }}
                  >
                    <LineChartComponent
                      data={sampleData}
                      options={sampleOptions}
                    />
                  </div>
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">分析情報</h3>
                <div className="form-group">
                  <label htmlFor="customAnalysis">カスタム分析</label>
                  <select
                    className="form-control"
                    id="customAnalysis"
                    value={selectedCustomAnalysis}
                    onChange={event =>
                      setSelectedCustomAnalysis(event.target.value)
                    }
                  >
                    <option value="product">商品分析</option>
                    <option value="sales">営業分析</option>
                    <option value="expenses">経費分析</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="customAnalysisSub">サンプル分析</label>
                  <select
                    className="form-control"
                    id="customAnalysisSub"
                    value={44}
                  >
                    <option value="44">サンプル分析</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="customAnalysisSub">サンプル分析</label>
                  <select
                    className="form-control"
                    id="customAnalysisSub"
                    value={44}
                  >
                    <option value="44">サンプル分析</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="customAnalysisSub">サンプル分析</label>
                  <select
                    className="form-control"
                    id="customAnalysisSub"
                    value={44}
                  >
                    <option value="44">サンプル分析</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Test;
