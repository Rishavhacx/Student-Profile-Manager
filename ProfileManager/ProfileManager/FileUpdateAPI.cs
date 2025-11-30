using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ProfileManager.Models;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace ProfileManager;

public class FileUpdateAPI
{
    private readonly ILogger<FileUpdateAPI> _logger;

    public FileUpdateAPI(ILogger<FileUpdateAPI> logger)
    {
        _logger = logger;
    }

    [Function("UpdateStudentProfile")]
    public async Task<HttpResponseData> RunAsync(
     [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "students/{id}")] HttpRequestData req, FunctionContext context)
    {
        var id = context.BindingContext.BindingData["id"]?.ToString();
        var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        var updatedStudent = JsonConvert.DeserializeObject<StudentProfile>(requestBody);

        if (string.IsNullOrEmpty(id) || updatedStudent == null || string.IsNullOrEmpty(updatedStudent.StudentId))
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Invalid update request.");
            return badResponse;
        }


        var client = new CosmosClient(
            Environment.GetEnvironmentVariable("CosmosDbEndpoint"),
            Environment.GetEnvironmentVariable("CosmosDbKey")
        );
        var container = client.GetContainer(
            Environment.GetEnvironmentVariable("CosmosDbDatabaseName"),
            Environment.GetEnvironmentVariable("CosmosDbContainerName")
        );

        try
        {
            var existing = await container.ReadItemAsync<StudentProfile>(id, new PartitionKey(updatedStudent.StudentId));
            updatedStudent.Id = Guid.Parse(id);
            var response = await container.ReplaceItemAsync(updatedStudent, id, new PartitionKey(updatedStudent.StudentId));

            var okResponse = req.CreateResponse(HttpStatusCode.OK);
            await okResponse.WriteAsJsonAsync(new
            {
                message = "Student profile updated successfully",
                id = updatedStudent.Id,
                ruCharge = response.RequestCharge
            });
            return okResponse;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            var notFound = req.CreateResponse(HttpStatusCode.NotFound);
            await notFound.WriteStringAsync("Student profile not found.");
            return notFound;
        }

    }
}