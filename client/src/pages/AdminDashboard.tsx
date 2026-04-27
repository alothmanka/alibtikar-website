import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Save, RotateCcw, LogOut, Home, Shield, Loader2,
  Phone, Mail, Type, FileText, Globe, Pencil,
  Plus, Trash2, FolderPlus, Layers,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "wouter";

type ContentItem = {
  id: number;
  contentKey: string;
  valueEn: string;
  valueAr: string;
  category: string;
  label: string;
  fieldType: string;
  sortOrder: number;
  updatedAt: Date;
};

type EditState = Record<string, { valueEn: string; valueAr: string }>;

// Default categories with metadata
const DEFAULT_CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  hero: { label: "Hero Section", icon: <Globe className="h-4 w-4" />, description: "Main banner title, subtitle, and call-to-action button" },
  navigation: { label: "Navigation", icon: <Type className="h-4 w-4" />, description: "Navigation menu labels" },
  services: { label: "Services", icon: <FileText className="h-4 w-4" />, description: "Service titles and descriptions" },
  contact: { label: "Contact Details", icon: <Phone className="h-4 w-4" />, description: "Phone numbers, email, address, and labels" },
  form: { label: "Form Labels", icon: <Pencil className="h-4 w-4" />, description: "Contact form field labels and placeholders" },
  footer: { label: "Footer", icon: <FileText className="h-4 w-4" />, description: "Footer copyright text and links" },
  social: { label: "Social Media", icon: <Globe className="h-4 w-4" />, description: "Social media platform links (Facebook, Instagram, Twitter, LinkedIn, YouTube)" },
};

const DEFAULT_CATEGORY_ORDER = ["contact", "hero", "services", "navigation", "form", "footer", "social"];

const FIELD_TYPES = [
  { value: "text", label: "Text (single line)" },
  { value: "textarea", label: "Textarea (multi-line)" },
  { value: "phone", label: "Phone number" },
  { value: "email", label: "Email address" },
  { value: "url", label: "URL / Link" },
];

function getFieldIcon(fieldType: string) {
  switch (fieldType) {
    case "phone": return <Phone className="h-3.5 w-3.5 text-muted-foreground" />;
    case "email": return <Mail className="h-3.5 w-3.5 text-muted-foreground" />;
    default: return null;
  }
}

function getCategoryIcon(category: string) {
  const config = DEFAULT_CATEGORY_CONFIG[category];
  if (config) return config.icon;
  return <Layers className="h-4 w-4" />;
}

// ── Add Content Item Dialog ──
function AddContentDialog({
  categories,
  activeCategory,
  onAdd,
  isPending,
}: {
  categories: string[];
  activeCategory: string;
  onAdd: (data: { contentKey: string; valueEn: string; valueAr: string; category: string; label: string; fieldType: string; sortOrder: number }) => Promise<void>;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(activeCategory);
  const [label, setLabel] = useState("");
  const [contentKey, setContentKey] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [valueEn, setValueEn] = useState("");
  const [valueAr, setValueAr] = useState("");
  const [autoKey, setAutoKey] = useState(true);

  // Auto-generate content key from label + category
  useEffect(() => {
    if (autoKey && label) {
      const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      setContentKey(`${category}.${slug}`);
    }
  }, [label, category, autoKey]);

  // Update category when activeCategory changes
  useEffect(() => {
    setCategory(activeCategory);
  }, [activeCategory]);

  const resetForm = () => {
    setLabel("");
    setContentKey("");
    setFieldType("text");
    setValueEn("");
    setValueAr("");
    setAutoKey(true);
  };

  const handleSubmit = async () => {
    if (!contentKey.trim() || !label.trim() || !category.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await onAdd({
        contentKey: contentKey.trim(),
        valueEn: valueEn.trim(),
        valueAr: valueAr.trim(),
        category: category.trim(),
        label: label.trim(),
        fieldType,
        sortOrder: 100,
      });
      toast.success(`Content item "${label}" added successfully`);
      resetForm();
      setOpen(false);
    } catch {
      toast.error("Failed to add content item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Add Content Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Add New Content Item
          </DialogTitle>
          <DialogDescription>
            Create a new editable content field. It will appear on the website and be editable from this dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="add-category">Category / Section</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(cat)}
                      {DEFAULT_CATEGORY_CONFIG[cat]?.label || cat}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Label */}
          <div className="grid gap-2">
            <Label htmlFor="add-label">Display Label <span className="text-destructive">*</span></Label>
            <Input
              id="add-label"
              placeholder='e.g. "WhatsApp Number" or "Instagram Link"'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Content Key */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="add-key">Content Key <span className="text-destructive">*</span></Label>
              <button
                type="button"
                className="text-xs text-primary underline"
                onClick={() => setAutoKey(!autoKey)}
              >
                {autoKey ? "Edit manually" : "Auto-generate"}
              </button>
            </div>
            <Input
              id="add-key"
              placeholder="e.g. contact.whatsapp"
              value={contentKey}
              onChange={(e) => { setContentKey(e.target.value); setAutoKey(false); }}
              disabled={autoKey}
              className={autoKey ? "bg-muted/50" : ""}
            />
            <p className="text-[11px] text-muted-foreground">
              Unique identifier used internally. Format: <code>category.field_name</code>
            </p>
          </div>

          {/* Field Type */}
          <div className="grid gap-2">
            <Label>Field Type</Label>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((ft) => (
                  <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Values */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label className="flex items-center gap-1">
                <span className="inline-block w-5 h-3.5 rounded-sm bg-blue-100 text-blue-700 text-[9px] font-bold text-center leading-[14px]">EN</span>
                English Value
              </Label>
              <Input
                placeholder="English content..."
                value={valueEn}
                onChange={(e) => setValueEn(e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-1">
                <span className="inline-block w-5 h-3.5 rounded-sm bg-emerald-100 text-emerald-700 text-[9px] font-bold text-center leading-[14px]">AR</span>
                Arabic Value
              </Label>
              <Input
                placeholder="Arabic content..."
                value={valueAr}
                onChange={(e) => setValueAr(e.target.value)}
                dir="rtl"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending || !label.trim() || !contentKey.trim()} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Category Dialog ──
function AddCategoryDialog({
  existingCategories,
  onAdd,
  isPending,
}: {
  existingCategories: string[];
  onAdd: (data: { contentKey: string; valueEn: string; valueAr: string; category: string; label: string; fieldType: string; sortOrder: number }) => Promise<void>;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [firstItemLabel, setFirstItemLabel] = useState("");
  const [firstItemEn, setFirstItemEn] = useState("");
  const [firstItemAr, setFirstItemAr] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (autoSlug && categoryName) {
      setCategorySlug(categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""));
    }
  }, [categoryName, autoSlug]);

  const resetForm = () => {
    setCategoryName("");
    setCategorySlug("");
    setFirstItemLabel("");
    setFirstItemEn("");
    setFirstItemAr("");
    setAutoSlug(true);
  };

  const handleSubmit = async () => {
    if (!categoryName.trim() || !categorySlug.trim() || !firstItemLabel.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (existingCategories.includes(categorySlug.trim())) {
      toast.error("A category with this slug already exists");
      return;
    }
    const itemKey = `${categorySlug.trim()}.${firstItemLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
    try {
      await onAdd({
        contentKey: itemKey,
        valueEn: firstItemEn.trim(),
        valueAr: firstItemAr.trim(),
        category: categorySlug.trim(),
        label: firstItemLabel.trim(),
        fieldType: "text",
        sortOrder: 1,
      });
      toast.success(`New section "${categoryName}" created successfully`);
      resetForm();
      setOpen(false);
    } catch {
      toast.error("Failed to create new section");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <FolderPlus className="h-4 w-4" /> New Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" /> Create New Content Section
          </DialogTitle>
          <DialogDescription>
            Add a new category tab to organize content. You must add at least one item to create the section.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Section Name */}
          <div className="grid gap-2">
            <Label>Section Name <span className="text-destructive">*</span></Label>
            <Input
              placeholder='e.g. "Social Media" or "About Us"'
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          {/* Section Slug */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Section Slug <span className="text-destructive">*</span></Label>
              <button
                type="button"
                className="text-xs text-primary underline"
                onClick={() => setAutoSlug(!autoSlug)}
              >
                {autoSlug ? "Edit manually" : "Auto-generate"}
              </button>
            </div>
            <Input
              placeholder="e.g. social_media"
              value={categorySlug}
              onChange={(e) => { setCategorySlug(e.target.value); setAutoSlug(false); }}
              disabled={autoSlug}
              className={autoSlug ? "bg-muted/50" : ""}
            />
            <p className="text-[11px] text-muted-foreground">
              Used as the internal category identifier. Lowercase letters, numbers, and underscores only.
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-foreground mb-3">First Content Item</p>

            {/* First Item Label */}
            <div className="grid gap-2 mb-3">
              <Label>Item Label <span className="text-destructive">*</span></Label>
              <Input
                placeholder='e.g. "Twitter URL" or "Company Description"'
                value={firstItemLabel}
                onChange={(e) => setFirstItemLabel(e.target.value)}
              />
            </div>

            {/* First Item Values */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="flex items-center gap-1">
                  <span className="inline-block w-5 h-3.5 rounded-sm bg-blue-100 text-blue-700 text-[9px] font-bold text-center leading-[14px]">EN</span>
                  English
                </Label>
                <Input
                  placeholder="English value..."
                  value={firstItemEn}
                  onChange={(e) => setFirstItemEn(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-1">
                  <span className="inline-block w-5 h-3.5 rounded-sm bg-emerald-100 text-emerald-700 text-[9px] font-bold text-center leading-[14px]">AR</span>
                  Arabic
                </Label>
                <Input
                  placeholder="Arabic value..."
                  value={firstItemAr}
                  onChange={(e) => setFirstItemAr(e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !categoryName.trim() || !categorySlug.trim() || !firstItemLabel.trim()}
            className="gap-2"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
            Create Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Admin Dashboard ──
export default function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const utils = trpc.useUtils();

  // Check admin session
  const { data: sessionData } = trpc.adminAuth.checkSession.useQuery(undefined, {
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (sessionData !== undefined) {
      setIsAdminAuthenticated(sessionData.isAuthenticated);
      setIsLoadingAuth(false);
    }
  }, [sessionData]);

  const { data: contentItems, isLoading: contentLoading } = trpc.admin.getAllContent.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const updateMutation = trpc.admin.updateContent.useMutation({
    onSuccess: () => {
      utils.admin.getAllContent.invalidate();
      utils.content.getAll.invalidate();
    },
  });

  const upsertMutation = trpc.admin.upsertContent.useMutation({
    onSuccess: () => {
      utils.admin.getAllContent.invalidate();
      utils.content.getAll.invalidate();
    },
  });

  const deleteMutation = trpc.admin.deleteContent.useMutation({
    onSuccess: () => {
      utils.admin.getAllContent.invalidate();
      utils.content.getAll.invalidate();
    },
  });

  const [editState, setEditState] = useState<EditState>({});
  const [activeTab, setActiveTab] = useState("contact");
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

  // Initialize edit state when data loads
  useEffect(() => {
    if (contentItems) {
      const initial: EditState = {};
      contentItems.forEach((item: ContentItem) => {
        initial[item.contentKey] = { valueEn: item.valueEn, valueAr: item.valueAr };
      });
      setEditState(initial);
    }
  }, [contentItems]);

  // Group content by category
  const groupedContent = useMemo(() => {
    if (!contentItems) return {};
    const grouped: Record<string, ContentItem[]> = {};
    contentItems.forEach((item: ContentItem) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    Object.keys(grouped).forEach(cat => {
      grouped[cat].sort((a, b) => a.sortOrder - b.sortOrder);
    });
    return grouped;
  }, [contentItems]);

  // Build dynamic category order: defaults first, then any custom ones
  const allCategories = useMemo(() => {
    const cats = Object.keys(groupedContent);
    const ordered = DEFAULT_CATEGORY_ORDER.filter(c => cats.includes(c));
    const custom = cats.filter(c => !DEFAULT_CATEGORY_ORDER.includes(c)).sort();
    return [...ordered, ...custom];
  }, [groupedContent]);

  // Check if a field has been modified
  const isModified = useCallback((key: string) => {
    if (!contentItems || !editState[key]) return false;
    const original = contentItems.find((item: ContentItem) => item.contentKey === key);
    if (!original) return false;
    return original.valueEn !== editState[key].valueEn || original.valueAr !== editState[key].valueAr;
  }, [contentItems, editState]);

  // Count modified fields per category
  const modifiedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(groupedContent).forEach(cat => {
      counts[cat] = groupedContent[cat].filter(item => isModified(item.contentKey)).length;
    });
    return counts;
  }, [groupedContent, isModified]);

  const totalModified = Object.values(modifiedCounts).reduce((a, b) => a + b, 0);

  const handleFieldChange = (key: string, lang: "valueEn" | "valueAr", value: string) => {
    setEditState(prev => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
  };

  const handleSaveField = async (key: string) => {
    const values = editState[key];
    if (!values) return;
    try {
      await updateMutation.mutateAsync({
        contentKey: key,
        valueEn: values.valueEn,
        valueAr: values.valueAr,
      });
      toast.success("Content updated successfully");
    } catch {
      toast.error("Failed to update content");
    }
  };

  const handleSaveAll = async () => {
    const modified = contentItems?.filter((item: ContentItem) => isModified(item.contentKey)) || [];
    if (modified.length === 0) {
      toast.info("No changes to save");
      return;
    }
    let success = 0;
    let failed = 0;
    for (const item of modified) {
      const values = editState[item.contentKey];
      if (!values) continue;
      try {
        await updateMutation.mutateAsync({
          contentKey: item.contentKey,
          valueEn: values.valueEn,
          valueAr: values.valueAr,
        });
        success++;
      } catch {
        failed++;
      }
    }
    if (failed === 0) {
      toast.success(`All ${success} changes saved successfully`);
    } else {
      toast.warning(`${success} saved, ${failed} failed`);
    }
  };

  const handleResetField = (key: string) => {
    const original = contentItems?.find((item: ContentItem) => item.contentKey === key);
    if (!original) return;
    setEditState(prev => ({
      ...prev,
      [key]: { valueEn: original.valueEn, valueAr: original.valueAr },
    }));
  };

  const handleResetAll = () => {
    if (!contentItems) return;
    const initial: EditState = {};
    contentItems.forEach((item: ContentItem) => {
      initial[item.contentKey] = { valueEn: item.valueEn, valueAr: item.valueAr };
    });
    setEditState(initial);
    toast.info("All changes reset");
  };

  const handleAddContent = async (data: {
    contentKey: string; valueEn: string; valueAr: string;
    category: string; label: string; fieldType: string; sortOrder: number;
  }) => {
    await upsertMutation.mutateAsync(data);
    // Switch to the tab of the newly added item
    setActiveTab(data.category);
  };

  const handleDeleteContent = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({ contentKey: deleteTarget.contentKey });
      // Remove from edit state
      setEditState(prev => {
        const next = { ...prev };
        delete next[deleteTarget.contentKey];
        return next;
      });
      toast.success(`"${deleteTarget.label}" deleted successfully`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete content item");
    }
  };

  // Loading state
  if (isLoadingAuth || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not admin
  if (isLoadingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md text-center">
          <Shield className="h-16 w-16 text-destructive/60" />
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You do not have admin privileges to access this page.</p>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground leading-none">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Alibtikar Website Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {totalModified > 0 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                  {totalModified} unsaved {totalModified === 1 ? "change" : "changes"}
                </Badge>
              )}
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <Home className="h-4 w-4" /> View Site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={async () => {
                try {
                  await trpc.adminAuth.logout.useMutation().mutateAsync();
                } catch (e) {
                  console.error('Logout error:', e);
                }
                window.location.href = '/admin-login';
              }}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Site Content</h2>
            <p className="text-sm text-muted-foreground mt-1">Edit labels, descriptions, and contact details in English and Arabic</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <AddCategoryDialog
              existingCategories={allCategories}
              onAdd={handleAddContent}
              isPending={upsertMutation.isPending}
            />
            <AddContentDialog
              categories={allCategories}
              activeCategory={activeTab}
              onAdd={handleAddContent}
              isPending={upsertMutation.isPending}
            />
            <Button variant="outline" size="sm" onClick={handleResetAll} disabled={totalModified === 0} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset All
            </Button>
            <Button size="sm" onClick={handleSaveAll} disabled={totalModified === 0 || updateMutation.isPending} className="gap-2 bg-primary hover:bg-primary/90">
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save All Changes
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-background border mb-6 flex-wrap h-auto p-1 gap-1">
            {allCategories.map(cat => {
              const config = DEFAULT_CATEGORY_CONFIG[cat];
              return (
                <TabsTrigger key={cat} value={cat} className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                  {getCategoryIcon(cat)}
                  {config?.label || cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ")}
                  {(modifiedCounts[cat] ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {modifiedCounts[cat]}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {allCategories.map(cat => {
            const config = DEFAULT_CATEGORY_CONFIG[cat];
            const items = groupedContent[cat] || [];
            const isCustomCategory = !DEFAULT_CATEGORY_ORDER.includes(cat);
            return (
              <TabsContent key={cat} value={cat}>
                <div className="bg-background rounded-xl border shadow-sm">
                  <div className="p-6 border-b flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        {getCategoryIcon(cat)}
                        {config?.label || cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ")}
                        {isCustomCategory && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">Custom</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {config?.description || `Custom content section: ${cat}`}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </div>
                  </div>
                  <div className="divide-y">
                    {items.map((item) => {
                      const modified = isModified(item.contentKey);
                      const fieldIcon = getFieldIcon(item.fieldType);
                      const isTextarea = item.fieldType === "textarea";
                      const InputComponent = isTextarea ? Textarea : Input;

                      return (
                        <div key={item.contentKey} className={`p-6 transition-colors ${modified ? "bg-amber-50/50" : ""}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              {fieldIcon}
                              <span className="font-medium text-foreground">{item.label}</span>
                              <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                                {item.contentKey}
                              </Badge>
                              {modified && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">Modified</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {modified && (
                                <>
                                  <Button variant="ghost" size="sm" onClick={() => handleResetField(item.contentKey)} className="h-8 px-2 text-muted-foreground">
                                    <RotateCcw className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button size="sm" onClick={() => handleSaveField(item.contentKey)} disabled={updateMutation.isPending} className="h-8 px-3 bg-primary hover:bg-primary/90 gap-1">
                                    <Save className="h-3.5 w-3.5" /> Save
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteTarget(item)}
                                className="h-8 px-2 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                                <span className="inline-block w-5 h-3.5 rounded-sm bg-blue-100 text-blue-700 text-[9px] font-bold text-center leading-[14px]">EN</span>
                                English
                              </label>
                              <InputComponent
                                value={editState[item.contentKey]?.valueEn ?? item.valueEn}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleFieldChange(item.contentKey, "valueEn", e.target.value)}
                                className={`${isTextarea ? "min-h-[80px] resize-y" : ""} ${modified ? "border-amber-300 focus-visible:ring-amber-400" : ""}`}
                                dir="ltr"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                                <span className="inline-block w-5 h-3.5 rounded-sm bg-emerald-100 text-emerald-700 text-[9px] font-bold text-center leading-[14px]">AR</span>
                                Arabic
                              </label>
                              <InputComponent
                                value={editState[item.contentKey]?.valueAr ?? item.valueAr}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleFieldChange(item.contentKey, "valueAr", e.target.value)}
                                className={`${isTextarea ? "min-h-[80px] resize-y" : ""} ${modified ? "border-amber-300 focus-visible:ring-amber-400" : ""}`}
                                dir="rtl"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.label}"</strong> ({deleteTarget?.contentKey})?
              This action cannot be undone and the content will be permanently removed from the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContent}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
