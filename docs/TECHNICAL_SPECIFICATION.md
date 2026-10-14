\# Technical Specification: PharmaExpress M-Pesa Integration \& Architecture



\## 1. System Overview

PharmaExpress is a decoupled full-stack web application architected for real-time pharmaceutical ordering and automated mobile money checkout. It bridges a modern React single-page application with a native PHP REST API and MySQL database, integrating Safaricom's Daraja API for live STK Push payment processing.



\## 2. Architectural Components



| Layer | Technology | Responsibilities |

| :--- | :--- | :--- |

| \*\*Frontend\*\* | React (Vite), JavaScript, CSS3 | Customer storefront, dynamic cart management, checkout modal UI, and automated order polling. |

| \*\*Backend\*\* | PHP 8.x (Native REST, PDO) | Secure API endpoints for product catalog retrieval, order creation, and webhook event processing. |

| \*\*Database\*\* | MySQL / MariaDB (XAMPP) | Relational storage for products, user sessions, and order lifecycles (`Pending` vs `Completed`). |

| \*\*Payment Gateway\*\* | Safaricom Daraja Sandbox API | Initiates STK Push prompts to user handsets and dispatches asynchronous transaction webhooks. |

| \*\*Tunneling / Networking\*\* | Ngrok | Exposes local Apache server (`http://localhost`) to the public internet for secure callback handling. |



\---



\## 3. Payment \& Webhook Lifecycle



1\. \*\*Order Initiation:\*\* The user selects items in the React storefront, inputs their delivery details and phone number, and triggers checkout via `CheckoutModal.jsx`.

2\. \*\*STK Push Generation:\*\* The backend (`mpesa\\\_stk.php`) requests an OAuth access token from Safaricom and dispatches an STK Push API request to the customer's phone.

3\. \*\*User Authorization:\*\* The customer enters their PIN on their mobile device to authorize the sandbox transaction.

4\. \*\*Asynchronous Callback:\*\* Upon completion, Safaricom's servers send an HTTP POST request containing the transaction metadata (`ResultCode`, `CheckoutRequestID`, receipt numbers) to your public webhook URL.

5\. \*\*Webhook Logging \& Processing:\*\* The server logs raw payloads to `mpesa\\\_callbacks.log` and executes a database update query to reconcile the order state.



\---



\## 4. Security \& Best Practices

\* \*\*Credential Isolation:\*\* API keys, consumer secrets, and database configs are isolated inside a root `.env` file.

\* \*\*Version Control Protection:\*\* Sensitive environment files are ignored via `.gitignore` to prevent public credential exposure on GitHub.

\* \*\*Database Abstraction:\*\* Database queries utilize PDO (PHP Data Objects) with prepared statements to mitigate SQL injection vulnerabilities.







+---------------------------------------------------------------------------------------------------+

|                                      CLIENT SIDE (FRONTEND)                                       |

|  \[ React.js Single Page App ]  --->  (Triggers AJAX / Fetch Requests \& Auto-Polls every 10s)      |

+---------------------------------------------------------------------------------------------------+

&#x20;                                                 |

&#x20;                                                 v (HTTP REST API / JSON)

+---------------------------------------------------------------------------------------------------+

|                                      SERVER SIDE (BACKEND)                                        |

|  \[ XAMPP Local Environment (Apache + PHP 8.x) ]                                                   |

|    ├── db.php             (PDO Database Abstraction \& Secure Connection)                         |

|    ├── create\_order.php   (Order Insertion \& Validation Logic)                                   |

|    ├── mpesa\_stk.php      (Safaricom Daraja API STK Push Integration)                            |

|    └── mpesa\_callback.php (Secure Webhook Listener for Transaction Status Updates)               |

+---------------------------------------------------------------------------------------------------+

&#x20;                                                 |                                 ^

&#x20;                       (HTTP POST / STK Push)    |                                 | (Webhook Callback)

&#x20;                                                 v                                 |

+---------------------------------------------------------------------------------------------------+                                                 |

|                        EXTERNAL SYSTEMS \& SERVICES                                                |

|  \[ Safaricom M-Pesa Daraja API (Sandbox Gateway) ] <----------------------------------------------+

+---------------------------------------------------------------------------------------------------+

