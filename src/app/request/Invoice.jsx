import { Fragment, useEffect, useState } from 'react';
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import logo from '../../assets/images/saintaLOGO.png';

const Invoice = ({
  invoicesData,
  products,
  invoiceId,
  customers,
  businessData,
}) => {
  const [receiptData, setReceiptData] = useState({ ...invoicesData[0] });
  const [customerAddress, setCustomerAddress] = useState(
    '7, Ademola Odede, Ikeja, Lagos, Nigeria',
  );

  // styles for invoice
  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: 'column',
    },

    spaceBetween: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#3E3E3E',
    },

    titleContainer: { flexDirection: 'row', marginTop: 24 },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: 'center' },

    addressTitle: { fontSize: 11, fontStyle: 'bold' },

    invoice: { fontWeight: 'bold', fontSize: 20 },

    invoiceNumber: { fontSize: 11, fontWeight: 'bold' },

    address: { fontWeight: 400, fontSize: 10 },

    theader: {
      marginTop: 20,
      fontSize: 10,
      fontStyle: 'bold',
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
      backgroundColor: '#DEDEDE',
      borderColor: 'whitesmoke',
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      borderColor: 'whitesmoke',
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    total: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1.5,
      borderColor: 'whitesmoke',
      borderBottomWidth: 1,
    },

    tbody2: { flex: 2, borderRightWidth: 1 },
  });

  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Image style={styles.logo} src={logo} />
        <Text style={styles.reportTitle}>SAINTA</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.invoice}>Invoice</Text>
          <Text style={styles.invoiceNumber}>
            Invoice number: {receiptData?.id}{' '}
          </Text>
        </View>
        <View>
          <Text style={styles.addressTitle}>7, Ademola Odede, </Text>
          <Text style={styles.addressTitle}>Ikeja,</Text>
          <Text style={styles.addressTitle}>Lagos, Nigeria.</Text>
        </View>
      </View>
    </View>
  );

  const UserAddress = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.addressTitle}>Bill to </Text>
          <Text style={styles.address}>
            {customerAddress
              ? customerAddress
              : '7, Ademola Odede, Ikeja, Lagos, Nigeria'}
          </Text>
        </View>
        <Text style={styles.addressTitle}>
          Date: {new Date(receiptData?.invoice_date).toISOString().slice(0, 10)}
        </Text>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text>Items</Text>
      </View>
      <View style={styles.theader}>
        <Text>Price</Text>
      </View>
      <View style={styles.theader}>
        <Text>Qty</Text>
      </View>
      <View style={styles.theader}>
        <Text>Amount</Text>
      </View>
    </View>
  );

  const TableBody = () =>
    receiptData?.invoice_items?.map(receipt => {
      const product = products.find(p => p.id === receipt?.product_id);

      return (
        <Fragment key={receipt?.product_id}>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={[styles.tbody, styles.tbody2]}>
              <Text>{product?.productName}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{product?.productPrice} </Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.quantity}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>
                {(product?.productPrice * receipt?.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        </Fragment>
      );
    });

  const SubTotal = () => (
    <View style={{ width: '100%', flexDirection: 'row' }}>
      <View style={styles.total}>
        <Text></Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>sub total</Text>
      </View>
      <View style={styles.tbody}>
        <Text>{receiptData?.subtotal?.toFixed(2)}</Text>
      </View>
    </View>
  );

  const TaxTotal = () => (
    <View style={{ width: '100%', flexDirection: 'row' }}>
      <View style={styles.total}>
        <Text></Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>Taxes</Text>
      </View>
      <View style={styles.tbody}>
        <Text>{receiptData?.taxes?.toFixed(2)}</Text>
      </View>
    </View>
  );

  const TableTotal = () => (
    <View style={{ width: '100%', flexDirection: 'row' }}>
      <View style={styles.total}>
        <Text></Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>Total</Text>
      </View>
      <View style={styles.tbody}>
        <Text>{receiptData?.total_amount?.toFixed(2)}</Text>
      </View>
    </View>
  );

  // useEffect to filter Invoice data
  useEffect(() => {
    if (invoiceId) {
      const selectedInvoice = invoicesData?.filter(
        invoice => invoice.id === invoiceId,
      )[0];

      if (selectedInvoice) {
        const customer = customers.find(
          c => c.id === selectedInvoice?.customer_id,
        );
        setCustomerAddress(customer?.address);
        setReceiptData(selectedInvoice);
        console.log({ selectedInvoice, invoiceId });
      }
    }
  }, [invoiceId, invoicesData, customers]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <Address />
        <UserAddress />
        <TableHead />
        <TableBody />
        <SubTotal />
        <TaxTotal />
        <TableTotal />
      </Page>
    </Document>
  );
};

export default Invoice;
