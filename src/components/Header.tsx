import { Building2, Phone, MessageCircle } from "lucide-react";
import { hotelData } from "../data/data.js";

const Header = () => {
  return (
    <header className="bg-gradient-premium shadow-premium border-b border-gold/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Hotel Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Building2 className="h-8 w-8 text-gold" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-black">
                {hotelData.name}
              </h1>
              <p className="text-sm text-white font-medium">
                {hotelData.location} • Premium Hospitality
              </p>
            </div>
          </div>

                          <div>
            <p className="text-sm text-white font-medium text-center">
             Design and Developed by:<p className="text-lg font-semibold"> Revanth kumar Yallanur </p> </p>

                          </div>
          {/* Contact Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-silver rounded-lg shadow-card">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{hotelData.phone}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-gold rounded-lg shadow-gold">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 pt-4 border-t border-gold/20">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#billing" className="text-foreground hover:text-gold transition-colors font-medium">
              Bill Generator
            </a>
            <a href="#preview" className="text-foreground hover:text-gold transition-colors font-medium">
              Preview & Export
            </a>
            <a href="#contact" className="text-foreground hover:text-gold transition-colors font-medium">
              Contact
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;