import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Search,
  Download,
  Loader2,
  Lock,
  RefreshCw,
} from 'lucide-react';
import API_URL from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface RegisteredUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  mobile_with_country_code: string;
  userType: 'organization' | 'student' | 'employee';
  organizationName?: string;
  address: string;
  createdAt: string;
}

interface Stats {
  total: number;
  organization: number;
  student: number;
  employee: number;
}

const ADMIN_PASSCODE = 'admin@2026'; // Apna passcode yahan set kar lena

const AdminDashboard = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');

  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, organization: 0, student: 0, employee: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/fta-auth/users`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load users');
      setUsers(data.users || []);
      setStats(data.stats || { total: 0, organization: 0, student: 0, employee: 0 });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not fetch users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchUsers();
    }
  }, [isUnlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsUnlocked(true);
    } else {
      toast({ title: 'Wrong Passcode', description: 'Invalid admin passcode', variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesType = filterType === 'all' || u.userType === filterType;
    const query = search.toLowerCase();
    const matchesSearch =
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.mobile.includes(query) ||
      (u.organizationName || '').toLowerCase().includes(query) ||
      u.address.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Mobile', 'Field', 'Organization', 'Address', 'Registered On'];
    const rows = filteredUsers.map((u) => [
      `"${u.first_name} ${u.last_name}"`,
      `"${u.email}"`,
      `"${u.mobile_with_country_code} ${u.mobile}"`,
      `"${u.userType}"`,
      `"${u.organizationName || '-'}"`,
      `"${u.address.replace(/"/g, '""')}"`,
      `"${new Date(u.createdAt).toLocaleString('en-IN')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fta-registered-users-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center bg-muted/30 py-12">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUnlock} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter Admin Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Unlock Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Registered Users Admin Panel</h1>
              <p className="text-sm text-muted-foreground">
                FTA Tool par register hue sabhi users ka live record
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportCSV} disabled={filteredUsers.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Total Users</p>
                  <p className="text-3xl font-bold mt-1">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Organizations</p>
                  <p className="text-3xl font-bold mt-1">{stats.organization}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600 opacity-80" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Students</p>
                  <p className="text-3xl font-bold mt-1">{stats.student}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-green-600 opacity-80" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Employees</p>
                  <p className="text-3xl font-bold mt-1">{stats.employee}</p>
                </div>
                <Briefcase className="h-8 w-8 text-amber-600 opacity-80" />
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter */}
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, mobile, company..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'organization', 'student', 'employee'].map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={filterType === type ? 'default' : 'outline'}
                    onClick={() => setFilterType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No users found.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/60 text-xs uppercase text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email & Mobile</th>
                      <th className="px-4 py-3">Field</th>
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3">Address</th>
                      <th className="px-4 py-3">Registered On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-4 py-3">
                          <div>{user.email}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.mobile_with_country_code} {user.mobile}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize bg-primary/10 text-primary">
                            {user.userType}
                          </span>
                        </td>
                        <td className="px-4 py-3">{user.organizationName || '—'}</td>
                        <td className="px-4 py-3 max-w-xs truncate" title={user.address}>
                          {user.address}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;