module.exports = function stylesTemplate() {
  return `
  <style>
  body {
      margin: 0;
      padding: 0;
      background-color: #acacacff;
      font-family: Arial, sans-serif;
      color: #2e2e2e;
  }
  .wrapper {
      padding: 40px 0;
      width: 100%;
  }
  .container {
      width: 600px;
      background: #fafafa;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin: 0 auto;
  }
  .header {
      background: #013220;
      padding: 20px;
  }
  .header table {
      width: 100%;
  }
  .header td {
      vertical-align: middle;
  }
  .header img {
      max-height: 50px;
      display: block;
  }
  .header h1 {
      margin: 0;
      font-size: 24px;
      color: #fdfdfd;
      font-weight: bold;
  }
  .header p {
      margin: 2px 0 0;
      font-size: 15px;
      color: #cce3cc;
      letter-spacing: 0.5px;
  }
  .body {
      padding: 32px;
      color: #2e2e2e;
      border-top: 10px solid #013220;
      border-left: 10px solid #0f4106; 
      border-right: 10px solid #0f4106; 
      border-bottom: 10px solid #14532d;
      box-sizing: border-box;  
  }
  .body h2 {
      margin-top: 0;
      font-size: 20px;
      color: #0f4106;
  }
  .body p {
      font-size: 17px;
      line-height: 1.6;
      margin: 0 0 16px;
  }
  .otp {
      margin: 24px 0;
      text-align: center;
  }
  .otp span {
      display: inline-block;
      padding: 12px 24px;
      font-size: 22px;
      font-weight: bold;
      color: #fdfdfd;
      background: #0f4106;
      border-radius: 6px;
      letter-spacing: 3px;
  }
  .small-text {
      font-size: 16px;
      color: #555555;
      line-height: 1.6;
      margin: 16px 0;
  }
  .small-text a {
      color: #0f4106;
      text-decoration: none;
      font-weight: bold;
  }
  .closing {
      margin: 32px 0 0;
      font-size: 16px;
      color: #2e2e2e;
  }
  .footer {
    background: #14532d;
    padding: 14px;
    text-align: center;
    font-size: 14px;
    color: #e0e0e0;
}
.footer a {
    color: #a8f5a8;
    text-decoration: none;
}
</style>
  `;
};
