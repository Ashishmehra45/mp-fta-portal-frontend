import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <PortalLayout>
      <div className="container py-24 text-center">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you requested does not exist on this portal.</p>
        <Button className="mt-6" asChild><Link to="/">Return to home</Link></Button>
      </div>
    </PortalLayout>
  );
};

export default NotFound;
