import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, LogOut, Upload, Trash2, Users, Image as ImageIcon } from "lucide-react";

interface Rsvp {
  id: string;
  name: string;
  attending: boolean;
  guest_count: number;
  dietary_restrictions: string | null;
  created_at: string;
}

interface PhotoFile {
  name: string;
  url: string;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"rsvps" | "photos">("rsvps");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) checkAdmin(s.user.id);
      else {
        setIsAdmin(false);
        setChecking(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) checkAdmin(data.session.user.id);
      else setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    setChecking(true);
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
    setChecking(false);
  };

  const loadRsvps = async () => {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRsvps(data as Rsvp[]);
  };

  const loadPhotos = async () => {
    const { data, error } = await supabase.storage
      .from("wedding-photos")
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      toast.error(error.message);
      return;
    }
    const items = (data || [])
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from("wedding-photos").getPublicUrl(f.name).data.publicUrl,
      }));
    setPhotos(items);
  };

  useEffect(() => {
    if (isAdmin) {
      loadRsvps();
      loadPhotos();
    }
  }, [isAdmin]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. If email confirmation is on, check your inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      const e = err as Error;
      toast.error(e.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from("wedding-photos")
          .upload(path, file, { contentType: file.type });
        if (error) throw error;
      }
      toast.success(`${files.length} photo(s) uploaded`);
      loadPhotos();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeletePhoto = async (name: string) => {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.storage.from("wedding-photos").remove([name]);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      loadPhotos();
    }
  };

  const handleDeleteRsvp = async (id: string) => {
    if (!confirm("Delete this RSVP?")) return;
    const { error } = await supabase.from("rsvps").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      loadRsvps();
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm bg-card border border-border rounded-lg p-8 shadow-sm">
          <h1 className="font-serif text-2xl text-center mb-1">Admin</h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            {isSignUp ? "Create admin account" : "Sign in to continue"}
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </form>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need to create one? Sign up"}
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-serif text-2xl">Not authorized</h1>
          <p className="text-sm text-muted-foreground">
            Your account ({session.user.email}) does not have admin access. Ask the site owner to
            grant you the <code className="px-1 bg-muted rounded">admin</code> role in the
            user_roles table.
          </p>
          <p className="text-xs text-muted-foreground break-all">User ID: {session.user.id}</p>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl">Wedding Admin</h1>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          <button
            onClick={() => setTab("rsvps")}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${
              tab === "rsvps"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            RSVPs ({rsvps.length})
          </button>
          <button
            onClick={() => setTab("photos")}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${
              tab === "photos"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-4 w-4 inline mr-2" />
            Photos ({photos.length})
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === "rsvps" && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Attending</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Dietary</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No RSVPs yet
                    </TableCell>
                  </TableRow>
                ) : (
                  rsvps.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            r.attending
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {r.attending ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>{r.guest_count}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {r.dietary_restrictions || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRsvp(r.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {tab === "photos" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <Label htmlFor="upload" className="block mb-2">
                Upload photos
              </Label>
              <Input
                id="upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                </p>
              )}
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                <Upload className="mx-auto h-8 w-8 mb-2 opacity-40" />
                No photos uploaded yet
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((p) => (
                  <div key={p.name} className="relative group rounded-lg overflow-hidden border border-border">
                    <img src={p.url} alt={p.name} className="w-full aspect-square object-cover" />
                    <button
                      onClick={() => handleDeletePhoto(p.name)}
                      className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
