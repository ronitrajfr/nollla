import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* New Badge */}
        <div className="flex justify-center">
          <Badge className="px-3 py-1 text-sm font-medium">
            New Design is out now!
          </Badge>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Experience
            <br />
            the <span className="text-brand-purple">Shadcn</span> landing page
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We're more than just a tool, we're a community of passionate creators.
          Get access to exclusive resources, tutorials, and support.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" className="min-w-40">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" className="min-w-40">
            <Github className="w-4 h-4" />
            Github repository
          </Button>
        </div>
      </div>
    </section>
  );
}
