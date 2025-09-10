import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, FileText, Users, Calendar, MapPin, Phone } from "lucide-react";
import { billTypes, defaultFormData, generateBillNumber } from "../data/data.js";
import { useToast } from "../hooks/use-toast";

interface BillGeneratorProps {
  onBillGenerate: (billData: any) => void;
}

const BillGenerator: React.FC<BillGeneratorProps> = ({ onBillGenerate }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [calculations, setCalculations] = useState({
    days: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    balance: 0
  });
  const { toast } = useToast();

  // Auto-calculate when relevant fields change
  useEffect(() => {
    calculateBill();
  }, [formData.checkInDate, formData.checkOutDate, formData.rooms, formData.roomDetails, formData.advancePaid, formData.beveragesBill]);

  const calculateBill = () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      setCalculations({ days: 0, subtotal: 0, tax: 0, total: 0, balance: 0 });
      return;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const days = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    // Calculate total for all rooms
    const roomsTotal = formData.roomDetails.reduce((total, room) => {
      return total + (days * room.unitPrice);
    }, 0);

    // Add beverages if it's a checkout bill
    const beveragesAmount = formData.billType === 'Check-Out Bill' ? formData.beveragesBill : 0;
    const subtotal = roomsTotal + beveragesAmount;
    const balance = subtotal - formData.advancePaid;

    setCalculations({ days, subtotal, tax: 0, total: subtotal, balance });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoomsChange = (roomCount: number) => {
    const newRoomDetails = Array(roomCount).fill(null).map((_, index) => 
      formData.roomDetails[index] || { roomType: '', unitPrice: 0 }
    );
    setFormData(prev => ({ 
      ...prev, 
      rooms: roomCount,
      roomDetails: newRoomDetails 
    }));
  };

  const handleRoomDetailChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      roomDetails: prev.roomDetails.map((room, i) => 
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };


  const validateForm = () => {
    if (!formData.guestName.trim()) {
      toast({ title: "Validation Error", description: "Guest name is required", variant: "destructive" });
      return false;
    }
    if (!formData.contactNo.trim().match(/^[6-9]\d{9}$/)) {
      toast({ title: "Validation Error", description: "Please enter a valid 10-digit mobile number", variant: "destructive" });
      return false;
    }
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast({ title: "Validation Error", description: "Check-in and check-out dates are required", variant: "destructive" });
      return false;
    }
    // Validate room details
    for (let i = 0; i < formData.roomDetails.length; i++) {
      const room = formData.roomDetails[i];
      if (!room.roomType.trim()) {
        toast({ title: "Validation Error", description: `Room ${i + 1} type is required`, variant: "destructive" });
        return false;
      }
      if (!room.unitPrice || room.unitPrice <= 0) {
        toast({ title: "Validation Error", description: `Room ${i + 1} unit price must be greater than 0`, variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const generateBill = () => {
    if (!validateForm()) return;

    const billData = {
      ...formData,
      calculations,
      billNumber: generateBillNumber(),
      issueDate: new Date().toISOString().split('T')[0],
      issueTime: new Date().toLocaleTimeString('en-IN', { hour12: true })
    };

    onBillGenerate(billData);
    toast({ title: "Bill Generated Successfully!", description: "You can now preview and download the bill", });
  };

  return (
    <section id="billing" className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Bill Generator</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter guest details and booking information to generate professional hotel bills
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-premium border-gold/20">
          <CardHeader className="bg-gradient-silver">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-gold" />
              Guest Information & Booking Details
            </CardTitle>
            <CardDescription>Fill in all required fields to generate the bill</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Guest Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="guestName" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold" />
                  Guest Name *
                </Label>
                <Input
                  id="guestName"
                  placeholder="Enter full name"
                  value={formData.guestName}
                  onChange={(e) => handleInputChange('guestName', e.target.value)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNo" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold" />
                  Contact Number *
                </Label>
                <Input
                  id="contactNo"
                  placeholder="10-digit mobile number"
                  value={formData.contactNo}
                  onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                Address
              </Label>
              <Textarea
                id="address"
                placeholder="Complete address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="border-gold/30 focus:ring-gold"
              />
            </div>

            {/* Occupancy Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="adults">Adults *</Label>
                <Input
                  id="adults"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.adults}
                  onChange={(e) => handleInputChange('adults', parseInt(e.target.value) || 1)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.children}
                  onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="checkInDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  Check-In Date *
                </Label>
                <Input
                  id="checkInDate"
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-In Time</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="checkOutDate">Check-Out Date *</Label>
                <Input
                  id="checkOutDate"
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-Out Time</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>
            </div>

            {/* Room Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="rooms">Number of Rooms *</Label>
                <Input
                  id="rooms"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.rooms}
                  onChange={(e) => handleRoomsChange(parseInt(e.target.value) || 1)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>

              {/* Dynamic Room Type and Price Fields */}
              {formData.roomDetails.map((room, index) => (
                <Card key={index} className="bg-gradient-silver border-gold/30 p-4">
                  <h4 className="font-medium text-gold mb-4">Room {index + 1} Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`roomType-${index}`}>Room Type *</Label>
                      <Input
                        id={`roomType-${index}`}
                        placeholder="e.g., Superior AC, Standard AC"
                        value={room.roomType}
                        onChange={(e) => handleRoomDetailChange(index, 'roomType', e.target.value)}
                        className="border-gold/30 focus:ring-gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`unitPrice-${index}`}>Unit Price (₹) *</Label>
                      <Input
                        id={`unitPrice-${index}`}
                        type="number"
                        min="0"
                        value={room.unitPrice}
                        onChange={(e) => handleRoomDetailChange(index, 'unitPrice', parseInt(e.target.value) || 0)}
                        className="border-gold/30 focus:ring-gold"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Bill Type & Payment */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="billType">Bill Type *</Label>
                <Select value={formData.billType} onValueChange={(value) => handleInputChange('billType', value)}>
                  <SelectTrigger className="border-gold/30 focus:ring-gold">
                    <SelectValue placeholder="Select bill type" />
                  </SelectTrigger>
                  <SelectContent>
                    {billTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advancePaid">Advance Paid (₹)</Label>
                <Input
                  id="advancePaid"
                  type="number"
                  min="0"
                  value={formData.advancePaid}
                  onChange={(e) => handleInputChange('advancePaid', parseInt(e.target.value) || 0)}
                  className="border-gold/30 focus:ring-gold"
                />
              </div>
            </div>

            {/* Beverages Bill - Only for Check-Out Bills */}
            {formData.billType === 'Check-Out Bill' && (
              <div className="space-y-2">
                <Label htmlFor="beveragesBill" className="flex items-center gap-2 text-gold">
                  <Calculator className="h-4 w-4" />
                  Beverages Bill (₹)
                </Label>
                <Input
                  id="beveragesBill"
                  type="number"
                  min="0"
                  value={formData.beveragesBill}
                  onChange={(e) => handleInputChange('beveragesBill', parseInt(e.target.value) || 0)}
                  className="border-gold/30 focus:ring-gold"
                  placeholder="Enter total beverages amount"
                />
              </div>
            )}

            {/* Calculations Display */}
            {calculations.days > 0 && (
              <Card className="bg-gradient-silver border-gold/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-gold" />
                    Bill Calculations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><span className="font-medium">No. of Days:</span> {calculations.days}</p>
                      <p><span className="font-medium">Total Rooms:</span> {formData.rooms}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg"><span className="font-bold">Subtotal:</span> <span className="text-gold font-bold">₹{calculations.subtotal.toLocaleString()}</span></p>
                      {formData.billType === 'Check-Out Bill' && formData.beveragesBill > 0 && (
                        <p><span className="font-medium">Beverages:</span> ₹{formData.beveragesBill.toLocaleString()}</p>
                      )}
                      <p><span className="font-medium">Advance Paid:</span> ₹{formData.advancePaid.toLocaleString()}</p>
                      <p className="text-lg"><span className="font-bold">Balance:</span> <span className="text-primary font-bold">₹{calculations.balance.toLocaleString()}</span></p>
                    </div>
                  </div>

                  {/* Room Details Summary */}
                  <div className="mt-4 pt-4 border-t border-gold/20">
                    <h4 className="font-medium text-gold mb-2">Room Breakdown:</h4>
                    {formData.roomDetails.map((room, index) => (
                      <div key={index} className="flex justify-between items-center py-1 text-sm">
                        <span>Room {index + 1}: {room.roomType || 'Not specified'}</span>
                        <span>₹{room.unitPrice.toLocaleString()} × {calculations.days} days = ₹{(room.unitPrice * calculations.days).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={generateBill}
              className="w-full bg-gradient-gold hover:bg-gold-dark text-primary font-semibold py-6 text-lg shadow-gold"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Generate Professional Bill
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BillGenerator;