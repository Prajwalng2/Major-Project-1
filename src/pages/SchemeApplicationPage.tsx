import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getSchemeById, submitSchemeApplication, uploadApplicationDocument } from "@/utils/schemeDataService";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, FileText, Upload } from "lucide-react";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "Please select a state" }),
  idType: z.string(),
  idNumber: z.string().min(4, { message: "ID number is required" }),
  additionalInfo: z.string().optional(),
});

const SchemeApplicationPage = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Record<string, File | null>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      idType: "aadhaar",
      idNumber: "",
      additionalInfo: "",
    },
  });
  
  useEffect(() => {
    const fetchScheme = async () => {
      if (!id) return;
      
      try {
        const schemeData = await getSchemeById(id);
        if (schemeData) {
          setScheme(schemeData);
          // Initialize document placeholders based on required documents
          if (schemeData.documents && schemeData.documents.length > 0) {
            const docObj: Record<string, File | null> = {};
            const progressObj: Record<string, number> = {};
            schemeData.documents.forEach((doc: string) => {
              const docKey = doc.toLowerCase().replace(/\s+/g, '-');
              docObj[docKey] = null;
              progressObj[docKey] = 0;
            });
            setDocuments(docObj);
            setUploadProgress(progressObj);
          }
        }
      } catch (error) {
        console.error("Error fetching scheme:", error);
        toast({
          title: "Error",
          description: "Failed to load scheme details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchScheme();
  }, [id, toast]);
  
  const handleFileChange = (documentType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocuments(prev => ({ ...prev, [documentType]: file }));
      // Reset progress when new file is selected
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
    }
  };
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    
    try {
      // Check if all required documents are uploaded
      if (scheme.documents && scheme.documents.length > 0) {
        const missingDocs = scheme.documents.filter((doc: string) => {
          const docKey = doc.toLowerCase().replace(/\s+/g, '-');
          return !documents[docKey];
        });
        
        if (missingDocs.length > 0) {
          toast({
            title: "Missing Documents",
            description: `Please upload the following required documents: ${missingDocs.join(', ')}`,
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
      }
      
      // Submit application
      const applicationData = {
        scheme_id: id,
        ...data,
        status: 'pending',
        documents: {},
        created_at: new Date(),
      };
      
      const { success, applicationId, error } = await submitSchemeApplication(applicationData);
      
      if (success && applicationId) {
        // Upload documents
        const documentUrls: Record<string, string> = {};
        
        if (scheme.documents && scheme.documents.length > 0) {
          for (const doc of scheme.documents) {
            const docKey = doc.toLowerCase().replace(/\s+/g, '-');
            const file = documents[docKey];
            
            if (file) {
              // Show upload progress
              setUploadProgress(prev => ({ ...prev, [docKey]: 30 }));
              
              const { success: uploadSuccess, url, error: uploadError } = 
                await uploadApplicationDocument(file, applicationId, docKey);
              
              setUploadProgress(prev => ({ ...prev, [docKey]: uploadSuccess ? 100 : 0 }));
              
              if (uploadSuccess && url) {
                documentUrls[docKey] = url;
              } else {
                toast({
                  title: "Document Upload Failed",
                  description: uploadError || "Failed to upload document. Please try again.",
                  variant: "destructive",
                });
              }
            }
          }
        }
        
        // Update application with document URLs
        if (Object.keys(documentUrls).length > 0) {
          // In a real app, we would update the application record with these URLs
          console.log("Document URLs:", documentUrls);
        }
        
        toast({
          title: "Application Submitted!",
          description: "Your application has been successfully submitted. You will receive a confirmation email shortly.",
        });
        
        // Redirect to confirmation page
        navigate(`/schemes/${id}/confirmation`);
      } else {
        toast({
          title: "Submission Failed",
          description: error || "Failed to submit your application. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-scheme-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading scheme details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!scheme) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Scheme Not Found</h1>
            <p className="text-gray-600 mb-6">The scheme you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/">Return to Home</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Apply for {scheme.title}</h1>
            <p className="text-gray-600">Fill out the form below to submit your application</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="idType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select ID type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                                <SelectItem value="pan">PAN Card</SelectItem>
                                <SelectItem value="voter">Voter ID</SelectItem>
                                <SelectItem value="driving">Driving License</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={`Enter your ${form.watch('idType') === 'aadhaar' ? 'Aadhaar' : form.watch('idType') === 'pan' ? 'PAN' : form.watch('idType') === 'voter' ? 'Voter ID' : 'Driving License'} number`}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Address Information</h2>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter your address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                                <SelectItem value="assam">Assam</SelectItem>
                                <SelectItem value="bihar">Bihar</SelectItem>
                                <SelectItem value="delhi">Delhi</SelectItem>
                                <SelectItem value="gujarat">Gujarat</SelectItem>
                                <SelectItem value="karnataka">Karnataka</SelectItem>
                                <SelectItem value="kerala">Kerala</SelectItem>
                                <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                                <SelectItem value="telangana">Telangana</SelectItem>
                                <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                                <SelectItem value="west-bengal">West Bengal</SelectItem>
                                {/* Other states would be added here */}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Required Documents</h2>
                    
                    {scheme.documents && scheme.documents.length > 0 ? (
                      <div className="space-y-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Important</AlertTitle>
                          <AlertDescription>
                            Please upload all required documents in PDF or image format (JPG, PNG). Maximum file size is 5MB.
                          </AlertDescription>
                        </Alert>
                        
                        {scheme.documents.map((doc: string) => {
                          const docKey = doc.toLowerCase().replace(/\s+/g, '-');
                          const fileSelected = !!documents[docKey];
                          const progress = uploadProgress[docKey] || 0;
                          
                          return (
                            <div key={docKey} className="border rounded-md p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  <Label htmlFor={`doc-${docKey}`}>{doc}</Label>
                                </div>
                                {fileSelected && (
                                  <div className="flex items-center text-green-600">
                                    <Check className="h-4 w-4 mr-1" />
                                    <span className="text-xs">File selected</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <Input
                                  id={`doc-${docKey}`}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileChange(docKey, e)}
                                  className="max-w-md"
                                />
                                
                                {fileSelected && (
                                  <p className="text-xs text-gray-500 truncate">
                                    {documents[docKey]?.name}
                                  </p>
                                )}
                              </div>
                              
                              {progress > 0 && (
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-600 h-1.5 rounded-full" 
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500">No documents are required for this scheme application.</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Additional Information</h2>
                    
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Any additional information you'd like to provide</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter any additional information that might be relevant to your application" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
            
            <div className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Scheme Information</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Scheme Name</h3>
                    <p>{scheme.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ministry</h3>
                    <p>{scheme.ministry}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p>{scheme.category}</p>
                  </div>
                  {scheme.deadline && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Application Deadline</h3>
                      <p>{scheme.deadline}</p>
                    </div>
                  )}
                  {scheme.benefitAmount && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Benefit Amount</h3>
                      <p>{scheme.benefitAmount}</p>
                    </div>
                  )}
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
                {scheme.documents && scheme.documents.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {scheme.documents.map((doc: string, index: number) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No specific documents listed for this scheme.</p>
                )}
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Help & Support</h2>
                <p className="text-gray-600 mb-4">Need help with your application? Contact our support team:</p>
                <p className="mb-1"><strong>Email:</strong> support@myscheme.gov.in</p>
                <p className="mb-1"><strong>Phone:</strong> 1800-123-4567</p>
                <p><strong>Hours:</strong> Monday to Friday, 9 AM to 5 PM</p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchemeApplicationPage;
