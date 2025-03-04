const generateSlug = (title: string): string => {
    
    let slug = title.toLowerCase().trim();
  
     
    slug = slug.replace(/[^a-z0-9]+/g, '-');
  
     
    slug = slug.replace(/^-+|-+$/g, '');
  
    // Append a timestamp to ensure uniqueness
    const timestamp = Date.now();
  
    return `${slug}-${timestamp}`;
  };
  
  export default generateSlug;