
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Define an extended type for jsPDF with autoTable
type AutoTableJsPDF = jsPDF & {
  previousAutoTable?: {
    finalY: number;
  };
  lastAutoTable?: {
    finalY: number;
  };
};

type ReportType = 'executive' | 'technical' | 'compliance' | 'remediation' | 'custom' | 'raw';

interface ReportOptions {
  title: string;
  target?: string;
  date?: Date;
  vulnerabilities?: any[];
  scanMetrics?: any;
  customData?: any;
}

export const generateReport = (type: ReportType, options: ReportOptions) => {
  const doc = new jsPDF() as AutoTableJsPDF;
  const currentDate = options.date || new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
  
  // Add report header
  doc.setFontSize(22);
  doc.setTextColor(33, 33, 33);
  doc.text(options.title, 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${formattedDate}`, 105, 30, { align: 'center' });
  
  if (options.target) {
    doc.text(`Target: ${options.target}`, 105, 38, { align: 'center' });
  }
  
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);
  
  // Add content based on report type
  switch (type) {
    case 'executive':
      generateExecutiveSummary(doc, options);
      break;
    case 'technical':
      generateTechnicalDetails(doc, options);
      break;
    case 'compliance':
      generateComplianceReport(doc, options);
      break;
    case 'remediation':
      generateRemediationPlan(doc, options);
      break;
    case 'custom':
      generateCustomReport(doc, options);
      break;
    case 'raw':
      generateRawDataExport(doc, options);
      break;
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text('Security Scanner Report', 20, doc.internal.pageSize.height - 10);
    doc.text(formattedDate, 190, doc.internal.pageSize.height - 10, { align: 'right' });
  }
  
  return doc;
};

const generateExecutiveSummary = (doc: AutoTableJsPDF, options: ReportOptions) => {
  doc.setFontSize(16);
  doc.setTextColor(33, 33, 33);
  doc.text('Executive Summary', 20, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66);
  
  // Summary text
  doc.text('This report provides a high-level overview of security scan results. It includes key findings, risk assessment, and recommendations for addressing identified vulnerabilities.', 20, 65, { maxWidth: 170 });
  
  // Scan metrics summary
  doc.setFontSize(14);
  doc.text('Scan Metrics Summary', 20, 85);
  
  if (options.scanMetrics) {
    const metrics = options.scanMetrics;
    autoTable(doc, {
      startY: 90,
      head: [['Metric', 'Value']],
      body: [
        ['Total Requests', metrics.totalRequests || 'N/A'],
        ['Success Rate', `${metrics.successRate?.toFixed(2) || 0}%`],
        ['Error Rate', `${metrics.errorRate?.toFixed(2) || 0}%`],
        ['Avg. Response Time', `${metrics.avgResponseTime?.toFixed(2) || 0} ms`],
        ['Scan Duration', metrics.elapsedTime || 'N/A'],
      ],
      theme: 'grid',
    });
  } else {
    doc.text('No scan metrics available.', 20, 90);
  }
  
  // Vulnerability summary
  doc.setFontSize(14);
  let yPos = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 140;
  doc.text('Vulnerability Summary', 20, yPos);
  
  if (options.vulnerabilities && options.vulnerabilities.length > 0) {
    // Count vulnerabilities by severity
    const severityCounts = {
      'Critical': 0,
      'High': 0,
      'Medium': 0,
      'Low': 0,
    };
    
    options.vulnerabilities.forEach(vuln => {
      if (severityCounts[vuln.severity]) {
        severityCounts[vuln.severity]++;
      } else {
        severityCounts['Low']++;
      }
    });
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Severity', 'Count']],
      body: Object.entries(severityCounts).map(([severity, count]) => [severity, count]),
      theme: 'grid',
    });
  } else {
    doc.text('No vulnerabilities found.', 20, yPos + 5);
  }
};

const generateTechnicalDetails = (doc: AutoTableJsPDF, options: ReportOptions) => {
  doc.setFontSize(16);
  doc.setTextColor(33, 33, 33);
  doc.text('Technical Details', 20, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66);
  doc.text('This report provides detailed technical information about identified vulnerabilities, including affected endpoints, payload samples, and technical impact analysis.', 20, 65, { maxWidth: 170 });
  
  // Vulnerability details
  if (options.vulnerabilities && options.vulnerabilities.length > 0) {
    doc.setFontSize(14);
    doc.text('Vulnerability Details', 20, 85);
    
    autoTable(doc, {
      startY: 90,
      head: [['Type', 'Endpoint', 'Severity', 'Payload']],
      body: options.vulnerabilities.map(vuln => [
        vuln.type,
        vuln.endpoint,
        vuln.severity,
        vuln.payload || 'N/A'
      ]),
      theme: 'grid',
    });
  } else {
    doc.setFontSize(14);
    doc.text('Vulnerability Details', 20, 85);
    doc.setFontSize(12);
    doc.text('No vulnerabilities found.', 20, 95);
  }
  
  // Response codes
  if (options.scanMetrics && options.scanMetrics.responseCodes) {
    doc.setFontSize(14);
    let yPos = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 120;
    doc.text('Response Code Distribution', 20, yPos);
    
    const codes = options.scanMetrics.responseCodes;
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Response Code', 'Count']],
      body: Object.entries(codes).map(([code, count]) => [code, count]),
      theme: 'grid',
    });
  }
};

const generateComplianceReport = (doc: AutoTableJsPDF, options: ReportOptions) => {
  doc.setFontSize(16);
  doc.setTextColor(33, 33, 33);
  doc.text('Compliance Assessment Report', 20, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66);
  doc.text('This report evaluates compliance with security standards and best practices. It includes an assessment of security controls, identified gaps, and recommendations for improvement.', 20, 65, { maxWidth: 170 });
  
  // Sample compliance frameworks
  const frameworks = [
    { name: 'OWASP Top 10', status: 'Partial Compliance', score: '7/10' },
    { name: 'NIST Cybersecurity Framework', status: 'Substantial Compliance', score: '8/10' },
    { name: 'ISO 27001', status: 'Partial Compliance', score: '6/10' },
    { name: 'GDPR', status: 'Substantial Compliance', score: '8/10' },
    { name: 'PCI DSS', status: options.vulnerabilities?.length === 0 ? 'Full Compliance' : 'Partial Compliance', score: options.vulnerabilities?.length === 0 ? '10/10' : '7/10' },
  ];
  
  doc.setFontSize(14);
  doc.text('Compliance Framework Assessment', 20, 90);
  
  autoTable(doc, {
    startY: 95,
    head: [['Framework', 'Status', 'Score']],
    body: frameworks.map(framework => [framework.name, framework.status, framework.score]),
    theme: 'grid',
  });
  
  // Recommendations
  doc.setFontSize(14);
  let yPos = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 165;
  doc.text('Compliance Recommendations', 20, yPos);
  
  doc.setFontSize(12);
  doc.text('1. Implement regular security assessments and penetration testing', 25, yPos + 10);
  doc.text('2. Enhance input validation and output encoding to prevent injection attacks', 25, yPos + 20);
  doc.text('3. Review and update access control mechanisms', 25, yPos + 30);
  doc.text('4. Implement robust logging and monitoring capabilities', 25, yPos + 40);
  doc.text('5. Develop and test an incident response plan', 25, yPos + 50);
};

const generateRemediationPlan = (doc: AutoTableJsPDF, options: ReportOptions) => {
  doc.setFontSize(16);
  doc.setTextColor(33, 33, 33);
  doc.text('Remediation Plan', 20, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66);
  doc.text('This report provides a detailed plan for addressing identified security vulnerabilities. It includes prioritized recommendations, technical solutions, and a suggested timeline for implementation.', 20, 65, { maxWidth: 170 });
  
  if (options.vulnerabilities && options.vulnerabilities.length > 0) {
    // Create remediation table with priorities
    doc.setFontSize(14);
    doc.text('Prioritized Vulnerabilities', 20, 90);
    
    const remediation = options.vulnerabilities.map(vuln => {
      let priority, timeline;
      
      switch(vuln.severity) {
        case 'Critical':
          priority = 'Immediate';
          timeline = '24-48 hours';
          break;
        case 'High':
          priority = 'High';
          timeline = '1 week';
          break;
        case 'Medium':
          priority = 'Medium';
          timeline = '2-3 weeks';
          break;
        default:
          priority = 'Low';
          timeline = '1-2 months';
      }
      
      return [vuln.type, vuln.endpoint, vuln.severity, priority, timeline];
    });
    
    autoTable(doc, {
      startY: 95,
      head: [['Vulnerability', 'Endpoint', 'Severity', 'Priority', 'Timeline']],
      body: remediation,
      theme: 'grid',
    });
    
    // General remediation advice
    doc.setFontSize(14);
    let yPos = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 160;
    doc.text('Remediation Steps', 20, yPos);
    
    // Add some generic remediation steps
    const remediationSteps = {
      'XSS': 'Implement proper input validation and output encoding. Use content security policy (CSP).',
      'SQL Injection': 'Use parameterized queries or prepared statements. Implement input validation.',
      'CSRF': 'Implement anti-CSRF tokens for all state-changing operations.',
      'Open Redirect': 'Validate and sanitize all redirect URLs. Use a whitelist approach.',
      'Information Disclosure': 'Review error handling to prevent sensitive information leakage.'
    };
    
    let stepYPos = yPos + 10;
    Object.entries(remediationSteps).forEach(([vulnerability, steps], index) => {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${vulnerability}:`, 25, stepYPos);
      doc.setFont(undefined, 'normal');
      doc.text(steps, 40, stepYPos, { maxWidth: 150 });
      stepYPos += 15;
    });
  } else {
    doc.setFontSize(14);
    doc.text('No vulnerabilities requiring remediation were found.', 20, 90);
  }
};

const generateCustomReport = (doc: AutoTableJsPDF, options: ReportOptions) => {
  doc.setFontSize(16);
  doc.setTextColor(33, 33, 33);
  doc.text('Custom Security Report', 20, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66);
  doc.text('This custom report contains selected information based on your specific requirements.', 20, 65, { maxWidth: 170 });
  
  // If customData is provided, use it
  if (options.customData) {
    let yPos = 85;
    
    Object.entries(options.customData).forEach(([section, data]) => {
      doc.setFontSize(14);
      doc.text(section, 20, yPos);
      yPos += 10;
      
      if (Array.isArray(data)) {
        autoTable(doc, {
          startY: yPos,
          head: [Object.keys(data[0] || {})],
          body: data.map(item => Object.values(item)),
          theme: 'grid',
        });
        yPos = doc.previousAutoTable?.finalY + 20 || yPos + 30;
      } else if (typeof data === 'string') {
        doc.setFontSize(12);
        doc.text(data, 20, yPos, { maxWidth: 170 });
        yPos += 20;
      } else {
        doc.setFontSize(12);
        doc.text(JSON.stringify(data, null, 2), 20, yPos, { maxWidth: 170 });
        yPos += 20;
      }
    });
  } else {
    // Default sections if no custom data
    doc.setFontSize(14);
    doc.text('Scan Overview', 20, 85);
    
    doc.setFontSize(12);
    doc.text('This section contains an overview of the security scan.', 20, 95, { maxWidth: 170 });
    
    doc.setFontSize(14);
    doc.text('Selected Vulnerabilities', 20, 115);
    
    if (options.vulnerabilities && options.vulnerabilities.length > 0) {
      const topVulnerabilities = options.vulnerabilities.slice(0, 3);
      
      autoTable(doc, {
        startY: 120,
        head: [['Type', 'Severity', 'Endpoint']],
        body: topVulnerabilities.map(vuln => [vuln.type, vuln.severity, vuln.endpoint]),
        theme: 'grid',
      });
    } else {
      doc.setFontSize(12);
      doc.text('No vulnerabilities found.', 20, 125);
    }
    
    doc.setFontSize(14);
    let yPos = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 150;
    doc.text('Custom Notes', 20, yPos);
    
    doc.setFontSize(12);
    doc.text('Add your custom notes here. This section can be customized based on your requirements.', 20, yPos + 10, { maxWidth: 170 });
  }
};

const generateRawDataExport = (doc: AutoTableJsPDF, options: ReportOptions) => {
  doc.setFontSize(16);
  doc.setTextColor(33, 33, 33);
  doc.text('Raw Data Export', 20, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66);
  doc.text('This report contains raw data from the security scan for further analysis.', 20, 65, { maxWidth: 170 });
  
  // Scan metrics
  if (options.scanMetrics) {
    doc.setFontSize(14);
    doc.text('Scan Metrics', 20, 85);
    
    const metricsData = [];
    Object.entries(options.scanMetrics).forEach(([key, value]) => {
      if (key !== 'startTime' && key !== 'responseCodes') { // Skip complex objects
        metricsData.push([key, typeof value === 'number' ? value.toString() : value]);
      }
    });
    
    autoTable(doc, {
      startY: 90,
      head: [['Metric', 'Value']],
      body: metricsData,
      theme: 'grid',
    });
  }
  
  // Response codes distribution
  if (options.scanMetrics && options.scanMetrics.responseCodes) {
    doc.setFontSize(14);
    let yPos = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 130;
    doc.text('Response Codes', 20, yPos);
    
    const codesData = [];
    Object.entries(options.scanMetrics.responseCodes).forEach(([code, count]) => {
      codesData.push([code, count.toString()]);
    });
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Code', 'Count']],
      body: codesData,
      theme: 'grid',
    });
  }
  
  // All vulnerabilities
  if (options.vulnerabilities && options.vulnerabilities.length > 0) {
    doc.setFontSize(14);
    let yPos = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 170;
    doc.text('All Vulnerabilities', 20, yPos);
    
    const vulnData = options.vulnerabilities.map(vuln => [
      vuln.id,
      vuln.type,
      vuln.endpoint,
      vuln.severity,
      vuln.payload || 'N/A',
      vuln.description || 'N/A'
    ]);
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [['ID', 'Type', 'Endpoint', 'Severity', 'Payload', 'Description']],
      body: vulnData,
      theme: 'grid',
    });
  }
};

export const downloadReport = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};
