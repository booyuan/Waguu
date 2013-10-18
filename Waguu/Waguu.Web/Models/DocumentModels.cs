using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Waguu.Web.Models
{
    public class Document
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
    }

    public static class DocumentRepository
    {
        private static readonly Random getrandom = new Random();

        static List<Document> objList;
        public static IEnumerable<Document> GetData(int pageIndex, int pageSize)
        {
            int startAt = (pageIndex - 1) * pageSize;
            objList = new List<Document>();
            Document obj;
            // int n = getrandom.Next(5, 9);
            // int nWidth = getrandom.Next(90, 100); 
            for (int i = startAt; i < startAt + pageSize; i++)
            {
                //n = getrandom.Next(1, 7);
                obj = new Document();
                obj.Title = GenerateRandomTitle();
                obj.Content = GenerateRandomContent();//String.Format("<img src=\"http://dummyimage.com/{3}x{1}/{0}{0}{0}/fff.png&text={3}\" />", n, n * 50 * 2, i + 1, 250); 
                obj.Description = "Description of product " + (i + 1).ToString();
                objList.Add(obj);
            }
            return objList;
        }

        public static string GenerateRandomTitle()
        {
            string title = String.Empty;
            int n = getrandom.Next(0, 10);
            title += GetRandomWord();
            for (int i = 0; i < n; i++)
            {
                title += " " + GetRandomWord();
            }
            return title;
        }

        public static string GenerateRandomContent()
        {
            string content = String.Empty;
            int n = getrandom.Next(1, 4);
            for (int i = 0; i < n; i++)
            {
                content += GenerateRandomSection();
            }
            return content;
        }

        private static string GenerateRandomSection()
        {
            string section = String.Empty;
            int whatContent = getrandom.Next(0, 4);
            if (whatContent == 1)
            {
                section += GenerateRandomPicture();
                // section += GenerateRandomParagraph();
            }
            else
            {
                section += GenerateRandomParagraph();
            }
            return section;
        }

        private static string GenerateRandomParagraph()
        {
            string paragraph = "<p>    ";
            int numberOfWords = getrandom.Next(20, 50);
            for (int i = 0; i < numberOfWords; i++)
            {
                paragraph += GetRandomWord() + " ";
            }
            return paragraph + "</p>";
        }

        private static string GenerateRandomPicture()
        {
            string picture = String.Empty;
            int n = getrandom.Next(3, 7);
            int nWidth = 330;
            int r = getrandom.Next(0, 255);
            int g = getrandom.Next(0, 255);
            int b = getrandom.Next(0, 255);
            picture = String.Format("<p><img style=\"float: center; padding: 7px 7px 7px 0px;\"  src=\"http://dummyimage.com/{2}x{1}/{3}{4}{5}/fff.png&text=@\" /></p>", n * 30, n * 50, nWidth, r, g, b);
            return picture;
        }

        private static string GetRandomWord()
        {
            string[] wordList = { "You", "are", "less", "word", "random", "test", "descrption", "picture", "double", "video", "have", "point", "." };
            int i = getrandom.Next(0, wordList.Length - 1);
            return wordList[i];
        }
    }
}