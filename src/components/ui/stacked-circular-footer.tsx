import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

function StackedCircularFooter() {
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-primary/10 p-8">
            <Icons.logo className="icon-class w-6" />
          </div>
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/services" className="hover:text-primary">Services</Link>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
          <div className="mb-8 w-full max-w-md">
            <form className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" className="rounded-full" />
              </div>
              <Button type="submit" className="rounded-full">Subscribe</Button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { StackedCircularFooter };
