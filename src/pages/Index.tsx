import { useState } from "react";
import Header from "../components/Header";
import BillGenerator from "../components/BillGenerator";
import BillPreview from "../components/BillPreview";

const Index = () => {
  const [currentBill, setCurrentBill] = useState(null);

  const handleBillGenerate = (billData: any) => {
    setCurrentBill(billData);
    // Smooth scroll to preview section
    setTimeout(() => {
      document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <BillGenerator onBillGenerate={handleBillGenerate} />
        <BillPreview billData={currentBill} />
      </main>

      <footer className="bg-gradient-premium text-foreground py-8 border-t border-gold/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vasavi Grand, Tirupati. Professional Hotel Billing System.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Designed for premium hospitality management
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;