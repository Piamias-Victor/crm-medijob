output "amplify_app_id" {
  value = aws_amplify_app.web.id
}

output "amplify_default_domain" {
  value = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.web.default_domain}"
}

output "amplify_console_url" {
  value = "https://${var.aws_region}.console.aws.amazon.com/amplify/home?region=${var.aws_region}#/${aws_amplify_app.web.id}"
}
