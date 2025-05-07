import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const TableDemo = () => {
  const [invoicesList, setInvoices] = useState(invoices);

  return (
    <div>
      <form
        className="mb-6 mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const invoiceNumber = formData.get("invoiceNumber");
          const paymentStatus = formData.get("paymentStatus");
          const totalAmount = formData.get("totalAmount");
          const paymentMethod = formData.get("paymentMethod");

          console.log(e.currentTarget, invoiceNumber);

          const newInvoice = {
            invoice: `INV${invoicesList.length + 1}`,
            paymentStatus: paymentStatus as string,
            totalAmount: totalAmount as string,
            paymentMethod: paymentMethod as string,
          };

          setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);

          e.currentTarget.reset();
        }}
      >
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex items-center justify-between w-full mt-4">
          <Input
            type="text"
            placeholder="Invoice Number"
            className="border border-gray-300 rounded-md p-2 w-full"
            name="invoiceNumber"
            required
          />
          <Input
            type="text"
            placeholder="Payment Status"
            className="border border-gray-300 rounded-md p-2 w-full ml-4"
            name="paymentStatus"
            required
          />
          <Input
            type="text"
            placeholder="Total Amount"
            className="border border-gray-300 rounded-md p-2 w-full ml-4"
            name="totalAmount"
            required
          />
          <Input
            type="text"
            placeholder="Payment Method"
            className="border border-gray-300 rounded-md p-2 w-full ml-4"
            name="paymentMethod"
            required
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 ml-4"
          >
            Submit
          </Button>
        </div>
        <div className="flex items-center justify-between w-full mt-4">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <Button
            type="button"
            className="bg-blue-500 text-white rounded-md p-2 ml-4"
            onClick={() => {
              // handle search
            }}
          >
            Search
          </Button>
          <Button
            type="button"
            className="bg-blue-500 text-white rounded-md p-2 ml-4"
            onClick={() => {
              // handle reset
            }}
          >
            Reset
          </Button>
        </div>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead className="w-[200px]">Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoicesList.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TableDemo;
