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

  const downloadPDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.querySelector('.bill-content') as HTMLElement;
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${billData.billNumber}-${billData.guestName}.pdf`);
      toast({ title: "Success", description: "PDF downloaded successfully!" });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to generate PDF. Please try again.", 
        variant: "destructive"
      });
    }
  };

  const downloadDOCX = async () => {
    try {
      const { saveAs } = await import('file-saver');
      
      // Create HTML content for DOCX
      const htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .hotel-name { font-size: 24px; font-weight: bold; }
            .bill-details { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .summary { margin-top: 20px; }
            .total { font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hotel-name">${hotelData.name}</div>
            <div>${hotelData.address}</div>
            <div>Phone: ${hotelData.phone} | WhatsApp: ${hotelData.whatsapp}</div>
            <div>Email: ${hotelData.email} | GST: ${hotelData.gst}</div>
          </div>
          
          <div class="bill-details">
            <h2>${billData.billType}</h2>
            <p>Bill No: ${billData.billNumber}</p>
            <p>Date: ${billData.issueDate}</p>
            <p>Time: ${billData.issueTime}</p>
          </div>
          
          <div class="guest-details">
            <h3>Guest Information</h3>
            <p>Name: ${billData.guestName}</p>
            <p>Contact: ${billData.contactNo}</p>
            ${billData.address ? `<p>Address: ${billData.address}</p>` : ''}
            <p>Guests: ${billData.adults} Adults, ${billData.children} Children</p>
          </div>
          
           <table>
             <thead>
               <tr>
                 <th>Description</th>
                 <th>Days</th>
                 <th>Rate (₹)</th>
                 <th>Amount (₹)</th>
               </tr>
             </thead>
             <tbody>
                 ${billData.roomDetails.map((room, index) => {
                   let roomDays = billData.calculations.days;
                   if (room.checkInDate && room.checkOutDate) {
                     const roomCheckIn = new Date(room.checkInDate);
                     const roomCheckOut = new Date(room.checkOutDate);
                     roomDays = Math.max(1, Math.ceil((roomCheckOut.getTime() - roomCheckIn.getTime()) / (1000 * 3600 * 24)));
                   }
                   return `<tr>
                     <td>${room.count}× ${room.roomType}${room.checkInDate && room.checkOutDate && (room.checkInDate !== billData.checkInDate || room.checkOutDate !== billData.checkOutDate) ? `<br><small>(${room.checkInDate} to ${room.checkOutDate})</small>` : ''}</td>
                     <td>${roomDays}</td>
                     <td>₹${room.unitPrice.toLocaleString()}</td>
                     <td>₹${(room.unitPrice * roomDays * (room.count || 1)).toLocaleString()}</td>
                   </tr>`;
                 }).join('')}
               ${billData.billType === 'Check-Out Bill' && billData.beveragesBill > 0 ? 
                 `<tr>
                   <td>Beverages</td>
                   <td>-</td>
                   <td>-</td>
                   <td>₹${billData.beveragesBill.toLocaleString()}</td>
                 </tr>` : ''
               }
             </tbody>
           </table>
          
          <div class="summary">
            <p class="total">Total: ₹${billData.calculations.total.toLocaleString()}</p>
            <p>Advance Paid: ₹${billData.advancePaid.toLocaleString()}</p>
            <p class="total">Balance Due: ₹${billData.calculations.balance.toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 50px;">
            <p>Thank you for choosing ${hotelData.name}. We hope you have a pleasant stay!</p>
            <br><br>
            <p>Authorized Signatory</p>
            <p>_________________________</p>
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      saveAs(blob, `${billData.billNumber}-${billData.guestName}.doc`);
      toast({ title: "Success", description: "DOCX downloaded successfully!" });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to generate DOCX. Please try again.", 
        variant: "destructive" 
      });
    }
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
            <div className="p-8 print:p-4 bill-content">
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
                     <p><span className="font-medium">Main Check-In:</span> {billData.checkInDate} {billData.checkInTime || 'N/A'}</p>
                     <p><span className="font-medium">Main Check-Out:</span> {billData.checkOutDate} {billData.checkOutTime || 'N/A'}</p>
                     <p><span className="font-medium">Total Rooms:</span> {billData.roomDetails.reduce((total, room) => total + (room.count || 1), 0)}</p>
                   </CardContent>
                </Card>
              </div>

               {/* Bill Details Table */}
               <div className="overflow-x-auto mb-6">
                 <table className="w-full border border-border">
                   <thead className="bg-gradient-silver">
                     <tr>
                       <th className="border border-border px-4 py-3 text-left font-medium">Description</th>
                       <th className="border border-border px-4 py-3 text-center font-medium">Days</th>
                       <th className="border border-border px-4 py-3 text-right font-medium">Rate (₹)</th>
                       <th className="border border-border px-4 py-3 text-right font-medium">Amount (₹)</th>
                     </tr>
                   </thead>
                     <tbody>
                        {billData.roomDetails.map((room, index) => {
                          // Calculate days for this specific room using the same logic as the generator
                          const checkInDate = room.checkInDate || billData.checkInDate;
                          const checkOutDate = room.checkOutDate || billData.checkOutDate;
                          const checkInTime = room.checkInTime || billData.checkInTime || '00:00';
                          const checkOutTime = room.checkOutTime || billData.checkOutTime || '00:00';

                          const checkInDateTime = new Date(`${checkInDate}T${checkInTime}`);
                          const checkOutDateTime = new Date(`${checkOutDate}T${checkOutTime}`);
                          const timeDiffMs = checkOutDateTime.getTime() - checkInDateTime.getTime();
                          const timeDiffHours = timeDiffMs / (1000 * 3600);
                          
                          let roomDays = Math.max(1, Math.ceil(timeDiffMs / (1000 * 3600 * 24)));
                          
                          // Apply individual room override if checkout exceeds 28 hours and override is disabled
                          if (timeDiffHours > 28 && room.overrideExtraDay === false) {
                            roomDays = Math.max(1, roomDays - 1);
                          }
                          
                          const hasCustomDates = (room.checkInDate && room.checkInDate !== billData.checkInDate) || 
                                                 (room.checkOutDate && room.checkOutDate !== billData.checkOutDate) ||
                                                 (room.checkInTime && room.checkInTime !== billData.checkInTime) ||
                                                 (room.checkOutTime && room.checkOutTime !== billData.checkOutTime);
                          
                          return (
                            <tr key={index}>
                              <td className="border border-border px-4 py-3">
                                {room.count}× {room.roomType}
                                {hasCustomDates && (
                                  <div className="text-xs text-muted-foreground">
                                    ({checkInDate} {checkInTime} to {checkOutDate} {checkOutTime})
                                    {timeDiffHours > 28 && room.overrideExtraDay === false && (
                                      <div className="text-yellow-600">*Late checkout - no extra day charged</div>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="border border-border px-4 py-3 text-center">{roomDays}</td>
                              <td className="border border-border px-4 py-3 text-right">₹{room.unitPrice.toLocaleString()}</td>
                              <td className="border border-border px-4 py-3 text-right font-medium">₹{(room.unitPrice * roomDays * (room.count || 1)).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      {billData.billType === 'Check-Out Bill' && billData.beveragesBill > 0 && (
                        <tr>
                          <td className="border border-border px-4 py-3">Beverages</td>
                          <td className="border border-border px-4 py-3 text-center">-</td>
                          <td className="border border-border px-4 py-3 text-right">-</td>
                          <td className="border border-border px-4 py-3 text-right font-medium">₹{billData.beveragesBill.toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                 </table>
               </div>

              {/* Bill Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-full max-w-md space-y-2">
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
                  
                  <div className="border-t border-border w-full inclined italic text-xs mx-auto mt-8"><p className="text-sm font-medium">Note:</p>This is computer generated bill no signature is needed</div>
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