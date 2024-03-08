# Fix It

## Description

This is a single page MERN application built for rental agents, owners and tenants to effectively manage the property maintenance tasks. This simple solution helps tenants to manage their complaints and get updated on the progress. The application also helps both property agents and owners to track the issues.

## Features

- **Easy Registration:** The users can create an account, login and manage different tasks based on their role(tenant, agent and owner)
- **Efficient way to raise mainatance issues:** The tenants can raise and update maintenance issues and can see the progress of them.
- **Easy tracking of maintance task progress:** Agents can change the status of complaints(open, In progress and resolved) and others (Owners and tenants) can view the current status of the property maintenance issues.
- **Management of maintence work quote:** When the new complaints(status-open) are raised the agents can add quotes of different businesses for approval. The owners can view and choose one of the quotes and can approve it.
- **View Properties:** The agents can view the property details that they manage and the owners can view the properties that they own.
- **Admin login:** The admin can view, add and update property details.

## Installation

- Install Node.js v16
- Clone the Repository from GitHub and navigate to the root directory
- Install necessary dependencies running the following command :

  ```
  npm i
  ```

  ```
  npm run seed
  ```

  Create a .env file in the folder 'server' and add the environment variable to hold your secret keys

  ```
  SECRET="YOUR SECRET KEY FOR AUTHENTICATION"
  S3_BUCKET="AWS S3 BUCKET NAME"
  ACCESS_KEY="AWS ACCESS_KEY"
  SECRET_KEY="AWS SECRET_KEY"
  ```

  Create a .env file in the folder 'client' and add the environment variable to hold your secret keys

  ```
  VITE_API_KEY = "REACT GOOGLE MAPS API KEY"
  ```

### Deployment Link :

https://rentals-fix-it-015339fa2e18.herokuapp.com/

# Usage

The application can be invoked in the terminal by using the following command:

```
npm run develop
```

Create accounts for owner, agent and tenant by selecting corresponding roles while sign up and then tenant can login and raise a complaint .The tenants can view the complaints they raised (status- open and in progress) in their dashboard when they login. If they want to add a new complaint then 'Add Complaint' can be clicked where they can enter complaint and upload images if any. On clicking on a particular complaint a form will be displayed where complaint details can be updated. Agents can view the open complaints in the dashboard when they sign in .They can also see the complaints according to status. When a new complaint is raised, they can change status and add quotes of different businesses for approval by owner. Owners can view and choose one of the quotes and approve it . These functionalities are done in a form which can be accessed by clicking on a particular complaint from dashboard.

![fix-it-gif](./client/public/images/fixit.gif)

### Screenshots

**SignIn**
![login](https://github.com/shimna-puthanayil/fix-it/assets/132061805/d326bc45-3734-4f33-8a79-29a6b10474d3)

**Signup**
![signup](https://github.com/shimna-puthanayil/fix-it/assets/132061805/49f493f8-55d7-4ba4-881a-0ee5416bf210)

### Tenant

**Profile**
![profile](https://github.com/shimna-puthanayil/fix-it/assets/132061805/c42dc019-4b02-4361-84fc-b748110d7d40)

**Add Complaint**
![add images](https://github.com/shimna-puthanayil/fix-it/assets/132061805/19c065f5-227b-4e0c-acd8-e59e743446be)

**Update Complaint**
![update complaint](https://github.com/shimna-puthanayil/fix-it/assets/132061805/dfe89a52-6043-4126-9f06-70ac623b03cc)

### Agent

**Profile**
![AG](https://github.com/shimna-puthanayil/fix-it/assets/132061805/e78ba917-3b27-45c4-9067-b9208ca31b8a)

**In Progress**
![IN](https://github.com/shimna-puthanayil/fix-it/assets/132061805/186e8027-466a-4990-86ca-15644b16d0c4)

**Complaint Details**
![Screen Shot 2024-03-03 at 7 15 44 pm](https://github.com/shimna-puthanayil/fix-it/assets/132061805/1cf1031b-824d-41fe-af88-7559409fe361)
![Screen Shot 2024-03-03 at 7 44 50 pm](https://github.com/shimna-puthanayil/fix-it/assets/132061805/fa2e1797-2190-4495-8aa6-4c26ac7d92c5)
![Screen Shot 2024-03-03 at 7 45 00 pm](https://github.com/shimna-puthanayil/fix-it/assets/132061805/4279c770-63e5-4087-b82b-f1e7aae5024d)

### Owner

**Profile**
![OWN](https://github.com/shimna-puthanayil/fix-it/assets/132061805/1f538550-abf2-4708-9c24-142554a6d4f6)

**Resolved**
![RES](https://github.com/shimna-puthanayil/fix-it/assets/132061805/1b2d4783-8145-4642-a3ff-2a9360afad5f)

**Approve Complaint**
![ow1](https://github.com/shimna-puthanayil/fix-it/assets/132061805/945239e7-49ff-426c-bf96-dee5b1a841cc)
![ow2](https://github.com/shimna-puthanayil/fix-it/assets/132061805/87ba4acd-8155-442e-b9c3-4c52156097eb)

### Admin

**Properties**
![admin1](https://github.com/shimna-puthanayil/fix-it/assets/132061805/74799810-9308-4207-b8a3-077858fb5ca6)

**Add property**
![admin2](https://github.com/shimna-puthanayil/fix-it/assets/132061805/5b3dc632-b913-4683-aa61-e6e4464cbeaa)
![Screen Shot 2024-03-02 at 7 03 25 pm](https://github.com/shimna-puthanayil/fix-it/assets/132061805/e974b04a-d913-47d5-8a02-edc9af831e9c)

**Update property**
![Screen Shot 2024-01-16 at 1 04 43 am](https://github.com/shimna-puthanayil/fix-it/assets/132061805/ca0aa271-b1ad-4318-9cec-bb2ed9fae214)

## Technologies, Tools And Database

- React JS
- Material UI
- Node
- Express
- Vite
- JavaScript
- Apolllo GraphQL
- MongoDB
- JWT for authentication

## Credits

#### References

https://mui.com/store/?utm_source=docs&utm_medium=referral&utm_campaign=templates-store

https://mui.com/x/react-data-grid/

https://mui.com/x/react-data-grid/editing/
