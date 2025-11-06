# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # for homework/dev only
    resource '*',
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options],
      expose:  ['ETag']  # optional
  end
end
