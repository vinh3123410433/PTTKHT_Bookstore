import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import hbs from "express-handlebars";
import moment from "moment";
import hbsHelpers from "./helpers.js";
import fs from "fs";

// Thiết lập __filename và __dirname cho ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a custom file loader that handles BOM characters
const customFileLoader = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for BOM and remove if present (BOM appears as �� at the beginning)
  if (content.charCodeAt(0) === 0xFEFF || 
      (content.length >= 3 && content.charCodeAt(0) === 0xEF && 
      content.charCodeAt(1) === 0xBB && content.charCodeAt(2) === 0xBF)) {
    console.log(`Removing BOM from template: ${filePath}`);
    return content.slice(1); // Remove BOM
  }
  
  return content;
};

const hbsInstance = hbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "../resources/views/layouts"),
  partialsDir: path.join(__dirname, "../resources/views/partials"),
  defaultLayout: "main",
  helpers: hbsHelpers,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  // Add custom template loader to handle BOM characters
  compileOptions: {
    preventIndent: true
  }
});

// Override default template loading function
const originalLoadTemplate = hbsInstance.getTemplateFromCache;
hbsInstance.getTemplateFromCache = function(templatePath, options) {
  try {
    return originalLoadTemplate.call(this, templatePath, options);
  } catch (error) {
    if (error.message && error.message.includes('Unrecognized text')) {
      console.warn(`Handlebars parsing error in ${templatePath}, attempting to fix BOM...`);
      
      try {
        // Try to load and fix the file manually
        const content = customFileLoader(templatePath);
        const template = this.handlebars.compile(content, options);
        return template;
      } catch (innerError) {
        console.error(`Failed to fix template ${templatePath}:`, innerError);
        throw error; // Throw the original error if fix fails
      }
    }
    throw error;
  }
};

const configViewEngine = (app) => {
  const staticPath = path.join(__dirname, "../public");
  
  // Enhanced static file middleware with better error handling
  app.use((req, res, next) => {
    // Only handle CSS, JS, image and font requests
    if (/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i.test(req.path)) {
      const filePath = path.join(staticPath, req.path);
      
      // Check if the file exists before attempting to serve it
      fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
          console.error(`Static file not found or not readable: ${filePath}`);
          return next(); // Skip to next middleware
        }
        
        // Set cache headers for better performance
        const maxAge = 86400000; // 1 day in milliseconds
        res.setHeader('Cache-Control', `public, max-age=${maxAge / 1000}`);
        res.setHeader('Expires', new Date(Date.now() + maxAge).toUTCString());
      });
    }
    next();
  });
  
  // Standard static file serving with improved options
  app.use(express.static(staticPath, {
    maxAge: '1d', // Cache for 1 day
    etag: true,
    lastModified: true,
    index: false, // Don't serve directory indexes
    setHeaders: (res, path) => {
      // Disable caching for HTML files
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // Đăng ký Handlebars engine với helpers
  app.engine("hbs", hbsInstance.engine);
  app.locals.hbsInstance = hbsInstance;

  // Set views folder và view engine
  app.set("views", path.join(__dirname, "../resources/views"));
  app.set("view engine", "hbs");
};

export default configViewEngine;
