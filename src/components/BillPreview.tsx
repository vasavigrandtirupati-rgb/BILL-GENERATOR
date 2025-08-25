import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Printer, Building2 } from "lucide-react";
import { hotelData } from "../data/data.js";
import { useToast } from "../hooks/use-toast";

interface BillPreviewProps {
  billData: any;
}

const BillPreview: React.FC<BillPreviewProps> = ({ billData }) => {
  const { toast } = useToast();

  if (!billData) {
    return (
      <section id="preview" className="py-12 bg-gradient-silver">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">No Bill Generated Yet</h3>
            <p className="text-muted-foreground">
              Please fill in the guest details and generate a bill to see the preview here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const downloadPDF = () => {
    // In a real implementation, this would generate a PDF
    toast({ 
      title: "PDF Download", 
      description: "PDF generation feature will be implemented with a PDF library", 
    });
  };

  const downloadDOCX = () => {
    // In a real implementation, this would generate a DOCX
    toast({ 
      title: "DOCX Download", 
      description: "DOCX generation feature will be implemented with a document library", 
    });
  };

  const printBill = () => {
    window.print();
  };

  return (
    <section id="preview" className="py-12 bg-gradient-silver">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Bill Preview & Export</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Review the generated bill and download in your preferred format
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={downloadPDF}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-card"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={downloadDOCX}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-card"
            >
              <Download className="h-4 w-4 mr-2" />
              Download DOCX
            </Button>
            <Button 
              onClick={printBill}
              variant="secondary"
              className="shadow-card"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Bill
            </Button>
          </div>

          {/* Bill Preview */}
          <Card className="bg-card shadow-premium border-gold/20 print:shadow-none print:border-none">
            <div className="p-8 print:p-4">
              {/* Hotel Header */}
              <div className="text-center mb-8 print:mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Building2 className="h-8 w-8 text-gold" />
                  <h1 className="text-3xl font-display font-bold text-foreground">{hotelData.name}</h1>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium">{hotelData.address}</p>
                  <p>Phone: {hotelData.phone} | WhatsApp: {hotelData.whatsapp}</p>
                  <p>Email: {hotelData.email} | GST: {hotelData.gst}</p>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Bill Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-gold mb-2">{billData.billType}</h2>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Bill No:</span> {billData.billNumber}</p>
                    <p><span className="font-medium">Date:</span> {billData.issueDate}</p>
                    <p><span className="font-medium">Time:</span> {billData.issueTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-gold text-primary px-4 py-2 rounded-lg">
                    <p className="font-bold text-lg">Total: ₹{billData.calculations.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="shadow-card border-gold/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Guest Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {billData.guestName}</p>
                    <p><span className="font-medium">Contact:</span> {billData.contactNo}</p>
                    {billData.address && <p><span className="font-medium">Address:</span> {billData.address}</p>}
                    <p><span className="font-medium">Guests:</span> {billData.adults} Adults, {billData.children} Children</p>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-gold/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><span className="font-medium">Check-In:</span> {billData.checkInDate} {billData.checkInTime}</p>
                    <p><span className="font-medium">Check-Out:</span> {billData.checkOutDate} {billData.checkOutTime}</p>
                    <p><span className="font-medium">No. of Days:</span> {billData.calculations.days}</p>
                    <p><span className="font-medium">Room Type:</span> {billData.roomType}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Bill Details Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full border border-border">
                  <thead className="bg-gradient-silver">
                    <tr>
                      <th className="border border-border px-4 py-3 text-left font-medium">Description</th>
                      <th className="border border-border px-4 py-3 text-center font-medium">Rooms</th>
                      <th className="border border-border px-4 py-3 text-center font-medium">Days</th>
                      <th className="border border-border px-4 py-3 text-right font-medium">Rate (₹)</th>
                      <th className="border border-border px-4 py-3 text-right font-medium">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-3">{billData.roomType}</td>
                      <td className="border border-border px-4 py-3 text-center">{billData.rooms}</td>
                      <td className="border border-border px-4 py-3 text-center">{billData.calculations.days}</td>
                      <td className="border border-border px-4 py-3 text-right">₹{billData.unitPrice.toLocaleString()}</td>
                      <td className="border border-border px-4 py-3 text-right font-medium">₹{billData.calculations.subtotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bill Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{billData.calculations.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (6%):</span>
                    <span>₹{(billData.calculations.tax / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (6%):</span>
                    <span>₹{(billData.calculations.tax / 2).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-gold">₹{billData.calculations.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Advance Paid:</span>
                    <span>₹{billData.advancePaid.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Balance Due:</span>
                    <span className="text-primary">₹{billData.calculations.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <Separator className="mb-6" />
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Thank you for choosing {hotelData.name}. We hope you have a pleasant stay!
                </p>
                <div className="pt-8">
                  <p className="text-sm font-medium">Authorized Signatory</p>
                  <div className="border-t border-border w-48 mx-auto mt-8"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BillPreview;