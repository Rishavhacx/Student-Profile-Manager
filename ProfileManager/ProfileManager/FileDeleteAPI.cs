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

public class FileDeleteAPI
{
    private readonly ILogger<FileDeleteAPI> _logger;

    public FileDeleteAPI(ILogger<FileDeleteAPI> logger)
    {
        _logger = logger;
    }

    [Function("DeleteStudentProfile")]
    public async Task<HttpResponseData> RunAsync(
    [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "students/{id}/{studentId}")] HttpRequestData req,
    FunctionContext context)
    {
        var id = context.BindingContext.BindingData["id"]?.ToString();
        var studentId = context.BindingContext.BindingData["studentId"]?.ToString();

        if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(studentId))
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Both id and studentId are required.");
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
            await container.DeleteItemAsync<StudentProfile>(id, new PartitionKey(studentId));

            var okResponse = req.CreateResponse(HttpStatusCode.OK);
            await okResponse.WriteStringAsync($"Student profile with studentId = {studentId} and id={id} deleted successfully.");
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