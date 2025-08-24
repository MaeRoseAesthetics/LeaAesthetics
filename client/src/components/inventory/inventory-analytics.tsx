import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Calendar, 
  Download,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Trash2,
  Target,
  Clock
} from "lucide-react";

// Mock data for analytics
const stockMovementData = [
  { month: "Jan", inbound: 1200, outbound: 980, waste: 45 },
  { month: "Feb", inbound: 1100, outbound: 1150, waste: 62 },
  { month: "Mar", inbound: 1350, outbound: 1090, waste: 38 },
  { month: "Apr", inbound: 1250, outbound: 1300, waste: 51 },
  { month: "May", inbound: 1400, outbound: 1250, waste: 43 },
  { month: "Jun", inbound: 1300, outbound: 1380, waste: 67 },
  { month: "Jul", inbound: 1500, outbound: 1420, waste: 55 },
  { month: "Aug", inbound: 1450, outbound: 1380, waste: 49 }
];

const costAnalysisData = [
  { category: "Injectables", cost: 15420, percentage: 45, trend: "+12%" },
  { category: "Treatment Supplies", cost: 8950, percentage: 26, trend: "+8%" },
  { category: "Equipment", cost: 6340, percentage: 18, trend: "-3%" },
  { category: "Skincare", cost: 3870, percentage: 11, trend: "+15%" }
];

const treatmentUsageData = [
  { treatment: "Botox Treatments", usage: 450, cost: 12500, efficiency: 92 },
  { treatment: "Dermal Fillers", usage: 320, cost: 8900, efficiency: 87 },
  { treatment: "Chemical Peels", usage: 180, cost: 2100, efficiency: 95 },
  { treatment: "LED Therapy", usage: 240, cost: 1800, efficiency: 89 },
  { treatment: "Microneedling", usage: 160, cost: 2400, efficiency: 91 }
];

const wasteAnalysisData = [
  { name: "Expired Products", value: 35, color: "#ef4444" },
  { name: "Damaged Goods", value: 25, color: "#f97316" },
  { name: "Overstock", value: 20, color: "#eab308" },
  { name: "Patient Cancellations", value: 15, color: "#3b82f6" },
  { name: "Training Usage", value: 5, color: "#8b5cf6" }
];

const forecastData = [
  { month: "Sep", predicted: 1420, actual: null, confidence: 0.85 },
  { month: "Oct", predicted: 1480, actual: null, confidence: 0.82 },
  { month: "Nov", predicted: 1520, actual: null, confidence: 0.78 },
  { month: "Dec", predicted: 1600, actual: null, confidence: 0.75 },
  { month: "Jan", predicted: 1380, actual: null, confidence: 0.71 },
  { month: "Feb", predicted: 1450, actual: null, confidence: 0.68 }
];

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

interface InventoryAnalyticsProps {
  className?: string;
}

export default function InventoryAnalytics({ className = "" }: InventoryAnalyticsProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState("usage");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const totalInventoryValue = costAnalysisData.reduce((acc, item) => acc + item.cost, 0);
  const totalWasteValue = wasteAnalysisData.reduce((acc, item) => acc + item.value, 0);
  const averageEfficiency = treatmentUsageData.reduce((acc, item) => acc + item.efficiency, 0) / treatmentUsageData.length;

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="usage">Treatment Usage</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Inventory Analytics Overview</h3>
              <p className="text-sm text-muted-foreground">
                Key performance indicators and trends
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Inventory Value</p>
                    <p className="text-2xl font-bold text-maerose-forest">
                      £{totalInventoryValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8.2% vs last month
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-maerose-sage" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Average Efficiency</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {averageEfficiency.toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2.1% vs last month
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Waste Reduction</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((100 - totalWasteValue) / 100 * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +5.3% vs last month
                    </p>
                  </div>
                  <Trash2 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Forecast Accuracy</p>
                    <p className="text-2xl font-bold text-purple-600">94.2%</p>
                    <p className="text-xs text-red-600 flex items-center mt-1">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -1.8% vs last month
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Movement Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Stock Movement Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stockMovementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="inbound" 
                      stackId="1" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Inbound"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outbound" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Outbound"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  Cost Distribution by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costAnalysisData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {costAnalysisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Inventory Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Stock replenishment completed</p>
                      <p className="text-sm text-muted-foreground">Hyaluronic Acid Fillers - 25 units received</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Low stock alert triggered</p>
                      <p className="text-sm text-muted-foreground">Botulinum Toxin - Only 3 units remaining</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">4 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Equipment maintenance scheduled</p>
                      <p className="text-sm text-muted-foreground">IPL Hair Removal System - Due in 5 days</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">6 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement" className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium">Stock Movement Analysis</h3>
            <p className="text-sm text-muted-foreground">Track inbound, outbound, and waste patterns</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Stock Movement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stockMovementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inbound" fill="#10b981" name="Inbound" />
                  <Bar dataKey="outbound" fill="#3b82f6" name="Outbound" />
                  <Bar dataKey="waste" fill="#ef4444" name="Waste" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Movement Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Package className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {stockMovementData.reduce((acc, item) => acc + item.inbound, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Inbound</p>
                  <Badge className="mt-1 bg-green-100 text-green-800">+12% vs last period</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {stockMovementData.reduce((acc, item) => acc + item.outbound, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Outbound</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-800">+8% vs last period</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {stockMovementData.reduce((acc, item) => acc + item.waste, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Waste</p>
                  <Badge className="mt-1 bg-red-100 text-red-800">-15% vs last period</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium">Cost Analysis & Budgeting</h3>
            <p className="text-sm text-muted-foreground">Monitor spending patterns and budget allocation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cost Breakdown */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {costAnalysisData.map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded mr-3"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <div>
                            <p className="font-medium">{category.category}</p>
                            <p className="text-sm text-muted-foreground">{category.percentage}% of total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">£{category.cost.toLocaleString()}</p>
                          <Badge 
                            variant={category.trend.startsWith('+') ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {category.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-maerose-forest">£{totalInventoryValue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget</span>
                        <span>£40,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-maerose-forest h-2 rounded-full" 
                          style={{ width: `${(totalInventoryValue / 40000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{((totalInventoryValue / 40000) * 100).toFixed(1)}% used</span>
                        <span>£{(40000 - totalInventoryValue).toLocaleString()} remaining</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Monthly Targets</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Aug Target</span>
                          <span className="text-green-600">✓ Met</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Sep Target</span>
                          <span className="text-orange-600">⚠ Watch</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Oct Target</span>
                          <span className="text-gray-400">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium">Treatment Usage Analytics</h3>
            <p className="text-sm text-muted-foreground">Analyze product usage patterns by treatment type</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Efficiency by Treatment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Treatment</th>
                      <th className="text-left p-2">Usage Count</th>
                      <th className="text-left p-2">Total Cost</th>
                      <th className="text-left p-2">Efficiency</th>
                      <th className="text-left p-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatmentUsageData.map((treatment, index) => (
                      <tr key={treatment.treatment} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{treatment.treatment}</td>
                        <td className="p-2">{treatment.usage}</td>
                        <td className="p-2">£{treatment.cost.toLocaleString()}</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-maerose-forest h-2 rounded-full" 
                                style={{ width: `${treatment.efficiency}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{treatment.efficiency}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge 
                            variant={treatment.efficiency > 90 ? 'default' : treatment.efficiency > 85 ? 'secondary' : 'destructive'}
                          >
                            {treatment.efficiency > 90 ? 'Excellent' : treatment.efficiency > 85 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Waste Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Analysis by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={wasteAnalysisData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {wasteAnalysisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Waste Reduction Opportunities</h4>
                  {wasteAnalysisData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Recommendation</p>
                    <p className="text-xs text-blue-700">
                      Focus on improving expiry date management and demand forecasting to reduce waste by up to 25%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium">Demand Forecasting & Predictions</h3>
            <p className="text-sm text-muted-foreground">AI-powered predictions for inventory planning</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>6-Month Demand Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={[...stockMovementData, ...forecastData]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="outbound" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Historical Usage"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted Usage"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Forecast Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Forecast Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forecastData.map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{item.month} 2024</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-maerose-forest h-2 rounded-full" 
                            style={{ width: `${item.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{(item.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900">Stock Up</h4>
                    <p className="text-sm text-green-700">
                      Increase Hyaluronic Acid Fillers by 15% for December season
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-medium text-orange-900">Monitor Closely</h4>
                    <p className="text-sm text-orange-700">
                      LED therapy supplies showing irregular demand patterns
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900">Optimize</h4>
                    <p className="text-sm text-blue-700">
                      Consider bulk purchasing for consistent high-usage items
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-red-500 bg-red-50">
                    <h4 className="font-medium text-red-900">Reduce</h4>
                    <p className="text-sm text-red-700">
                      Chemical peel supplies over-stocked - reduce next order by 20%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
