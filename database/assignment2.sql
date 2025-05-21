
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES ('Custom', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', 'Client');

UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

SELECT * FROM account;

DELETE FROM account
WHERE account_firstname = 'Custom'

SELECT * FROM public.inventory
ORDER BY inv_id ASC 

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small','a huge')
WHERE inv_id =10;


SELECT
inventory.inv_make
inventory.inv_model
FROM 
public.inventory;

