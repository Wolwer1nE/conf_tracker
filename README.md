# Setup for development

This project uses Dev container for development. To set up the development environment, follow these steps:
1. Open the project in Visual Studio Code.
2. Install the "Remote - Containers" extension if you haven't already (usually, VS Code will prompt you to install it when you open a dev container).
3. Click on the green button in the bottom left corner of VS Code and select "Reopen in Container". This will build the dev container and open the project inside it.
4. Create development database by running the following command in the terminal:
   ```
   rails db:create
   ``` 
5. Add default data to the database by running the following command in the terminal:
   ```
   rails db:seed
   ```
6. Start the development server by running the following command in the terminal:
    ```
    bin/dev
    ``` 
 ## Common Issues
 - Gem is not installed: If you encounter an error indicating that a gem is not installed, you can install it by running the following command in the terminal:
   ```
   bundle install
   ```
# How to contribute
1. Fork the repository and create a new branch for your feature or bug fix.
2. Make your changes and commit them with clear and descriptive messages.
3. Push your changes to your forked repository.
4. Create a pull request to the main repository, describing your changes and why they should be merged.